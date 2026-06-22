const OpenAI = require('openai');
const { searchBible } = require('./bibleIndex.js');
const { LOGIC_RULES } = require('./logicRules.js');
const { getDoctrinalLogic } = require('./doctrinalLogic.js');
const { getConnectionInstructions } = require('./propheticConnections.js');

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}

function extractOutputText(data) {
  if (!data) return '';
  if (data.output_text) return data.output_text;
  let output = '';
  if (Array.isArray(data.output)) {
    for (const item of data.output) {
      if (item.type === 'message' && Array.isArray(item.content)) {
        output += item.content.filter(p => p.type === 'output_text').map(p => p.text).join('\n');
      }
    }
  }
  return output;
}

function classifyQuestion(question) {
  const q = String(question || '').toLowerCase();
  const outside = ['suicide','kill myself','abuse','beating me','emergency','call police','court order','custody','lawyer','medical','doctor','diagnosis'];
  if (outside.some(x => q.includes(x))) return 'Outside scope';
  if (/(works salvation|saved by works|earn salvation|another gospel|false gospel|tongues.*salvation|baptism.*salvation)/.test(q)) return 'Must separate';
  if (/(dating.*unbeliever|marry.*unbeliever|unequally yoked)/.test(q)) return 'Must separate';
  if (/(song|music|clothing|pants|movie|style|preference)/.test(q)) return 'Biblical wisdom';
  return 'Bible answer';
}

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return json(405, { message: 'Use POST.' });
  if (!process.env.OPENAI_API_KEY) {
    return json(500, { message: 'OPENAI_API_KEY is not set in Netlify environment variables.' });
  }

  let question = '';
  try {
    const parsed = JSON.parse(event.body || '{}');
    question = String(parsed.question || '').slice(0, 1200).trim();
  } catch (err) {
    return json(400, { message: 'Invalid JSON body.' });
  }

  if (!question) return json(400, { message: 'Question is required.' });

  const passages = searchBible(question, 25);
  const passageText = passages.map((p, i) => `${i + 1}. ${p.ref} — ${p.text}`).join('\n');
  const suggestedOutcome = classifyQuestion(question);
  const doctrinalLogic = getDoctrinalLogic(question, passages);
  const connectionInstructions = getConnectionInstructions(question, passages);

  if (suggestedOutcome === 'Outside scope') {
    return json(200, {
      outcome: 'Outside scope',
      answer: 'This question appears to involve safety, legal, medical, abuse, or emergency issues. This Bible app is not designed to give that kind of advice. Please seek immediate help from a trusted responsible adult, pastor, civil authority, emergency service, doctor, or qualified counselor as appropriate.\n\nBible principle: God values life and justice, and civil authority exists to punish evil and protect good. See Romans 13:1-4.',
      showYourWork: 'The question triggered the app boundary rule for matters outside the intended Bible-separation and Bible-guidance scope.'
    });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are Bible Answers App 3.8 Antichrist Search Patch. You must answer under the following interpretive rules and source restraints.

${LOGIC_RULES}

Additional doctrinal reasoning layer triggered by this question/search:
${doctrinalLogic}

Additional prophetic connection helper triggered by this question/search:
${connectionInstructions}

Required answer style:
- Be clear and direct.
- Use truth in love.
- Give a practical conclusion, not vague filler.
- Always include Scripture references from the provided passages.
- Do not quote or rely on Scripture that is not included in the provided search results.
- If Scripture is clear, say so clearly.
- If Scripture does not directly settle the exact issue, say what Scripture establishes and stop there.
- Do not say "Christian wisdom is needed" as a dodge when the passages are enough to answer.
- Do not invent verses.
- For prophecy questions, actively compare repeated event markers across supplied passages.
- Treat repeated rare identifiers as cross-reference evidence, not as commentary.
- For Daniel/Revelation questions, compare shared identifiers such as little horn/beast, ten horns, great words/blasphemy, war with the saints, overcoming/wearing out saints, time-times-half-a-time, 42 months, and 1260 days.
- For antichrist questions, do not stop with only verses containing the exact word antichrist. Use supplied passages to compare the title/action cluster: antichrist, little horn, beast, man of sin, son of perdition, wicked one, mark/image of the beast, war with the saints, buying/selling control, and final judgment.
- State these as shared biblical identifiers and actions found in the supplied passages, not as internet/commentary claims.
- For sixth seal questions, compare sun, moon, stars, earthquake, heaven shaken, and day/wrath language.

Allowed outcomes: Must separate; Biblical caution; Proceed with gospel witness; Acceptable with wisdom; Insufficient Biblical evidence; Outside scope; Bible answer.

User question: ${question}

Suggested outcome from simple rules: ${suggestedOutcome}

Top 25 ranked KJV whole-Bible search results:
${passageText}

Before answering, apply the general rules first, then the doctrinal logic only if it helps interpret the supplied passages. Do not mention Greek unless one of the approved Greek notes is directly relevant and helpful.

Return strict JSON with these fields:
{
  "outcome": "one allowed outcome",
  "answer": "concise answer with Scripture references",
  "showYourWork": "brief explanation of the interpretive path used, including any Old Testament classification such as moral law, civil/judicial law, ceremonial law, national law, wisdom, prophecy, or narrative if relevant"
}`;

  try {
    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
      temperature: 0.2
    });

    const raw = extractOutputText(response).trim();
    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim());
    } catch (err) {
      parsed = {
        outcome: suggestedOutcome,
        answer: raw || 'The AI returned no answer text.',
        showYourWork: `Scripture searched:\n${passageText}`
      };
    }

    return json(200, {
      outcome: parsed.outcome || suggestedOutcome,
      answer: parsed.answer || 'No answer returned.',
      showYourWork: parsed.showYourWork || `Scripture searched:\n${passageText}`,
      passages
    });
  } catch (err) {
    return json(500, {
      message: 'OpenAI request failed.',
      detail: err.message,
      passages
    });
  }
};
