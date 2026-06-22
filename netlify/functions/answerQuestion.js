const OpenAI = require('openai');
const { searchBible } = require('./bibleIndex.js');
const { LOGIC_RULES } = require('./logicRules.js');
const { getDoctrinalLogic } = require('./doctrinalLogic.js');
const { getConnectionInstructions } = require('./propheticConnections.js');
const { getStudyProtocol } = require('./studyProtocol.js');
const { getRelationshipInstructions, getRelationshipPassages } = require('./relationshipEngine.js');
const { getContextInstructions, getContextPassages } = require('./contextRelationshipEngine.js');
const { getPrimaryQuestionType, getClassifierPassages, getClassifierInstructions } = require('./questionClassifier.js');

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

  let passages = searchBible(question, 25);
  const primaryQuestionType = getPrimaryQuestionType(question);
  const classifierPassages = getClassifierPassages(question, 35);
  const relationshipPassages = getRelationshipPassages(question, passages, 35);
  const contextPassages = getContextPassages(question, 45);
  if (classifierPassages.length || relationshipPassages.length || contextPassages.length) {
    const seen = new Set();
    passages = [...classifierPassages, ...contextPassages, ...relationshipPassages, ...passages].filter(p => {
      if (seen.has(p.ref)) return false;
      seen.add(p.ref);
      return true;
    }).slice(0, 50);
  }
  const passageText = passages.map((p, i) => `${i + 1}. ${p.ref} — ${p.text}`).join('\n');
  const suggestedOutcome = classifyQuestion(question);
  const doctrinalLogic = getDoctrinalLogic(question, passages);
  const connectionInstructions = getConnectionInstructions(question, passages);
  const studyProtocol = getStudyProtocol(question);
  const relationshipInstructions = getRelationshipInstructions(question, passages);
  const contextInstructions = getContextInstructions(question);
  const classifierInstructions = getClassifierInstructions(question);

  if (suggestedOutcome === 'Outside scope') {
    return json(200, {
      outcome: 'Outside scope',
      answer: 'This question appears to involve safety, legal, medical, abuse, or emergency issues. This Bible app is not designed to give that kind of advice. Please seek immediate help from a trusted responsible adult, pastor, civil authority, emergency service, doctor, or qualified counselor as appropriate.\n\nBible principle: God values life and justice, and civil authority exists to punish evil and protect good. See Romans 13:1-4.',
      showYourWork: 'The question triggered the app boundary rule for matters outside the intended Bible-separation and Bible-guidance scope.'
    });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are Bible Answers App 4.5 Participation Truth Guard and Context Relationship Engine. You must answer under the following interpretive rules and source restraints.

${LOGIC_RULES}

Question classification/routing layer triggered before search:
${classifierInstructions}

Additional doctrinal reasoning layer triggered by this question/search:
${doctrinalLogic}

Additional prophetic connection helper triggered by this question/search:
${connectionInstructions}

Biblical relationship engine triggered by this question/search:
${relationshipInstructions}

Context relationship engine triggered by this question:
${contextInstructions}

Bible-only study protocol triggered by this question:
${studyProtocol}

Required answer style:
- First answer the primary question the user actually asked, not merely a secondary word in the question.
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
- The Biblical Relationship Engine and Context Relationship Engine are only passage-gathering/study helpers. They are not authorities and must not force conclusions.
- The Biblical Question Classifier controls search priority. Direct passages for the primary question type must be weighed before secondary themes.
- Relationship clusters must be subordinate to question intent. Prophecy clusters must not override salvation, gospel, election, or definition questions unless the user question itself asks about prophecy/end-times subjects.
- When relationship clusters are supplied, compare the repeated textual markers and state the strength/limits of the connection from the supplied verses only.
- For Daniel/Revelation questions, compare shared identifiers such as little horn/beast, ten horns, great words/blasphemy, war with the saints, overcoming/wearing out saints, time-times-half-a-time, 42 months, and 1260 days.
- For antichrist questions, do not stop with only verses containing the exact word antichrist. Use supplied passages to compare the title/action cluster: antichrist, little horn, beast, man of sin, son of perdition, wicked one, mark/image of the beast, war with the saints, buying/selling control, and final judgment.
- For salvation/election/predestination questions, do not answer from isolated vocabulary. Compare the supplied passages across the full salvation subject before concluding: God's saving desire, man's responsibility, grace/faith/works, election/predestination/calling, condemnation/judgment, security, and gospel invitation.
- Context Relationship Engine rule: when a doctrinal term appears, do not define it by the term alone. First check the immediate context, object, audience, and purpose. Ask: chosen to what? predestinated to what? called by what means? saved from what and unto what? justified in what sense? works as basis, evidence, or walk?
- Treat Romans, Hebrews, Ephesians, and all other passages this way: immediate context first, then related contexts, then whole-Bible comparison. Do not let a related cluster override the direct context of the passage being discussed.
- For participation/separation questions, do not treat general love, mercy, kindness, or humility passages as the controlling issue. First examine whether the act requested is attendance, fellowship, agreement, support, partnership, celebration, or receiving/bidding God speed. Then apply love/truth passages as the manner of response, not as permission to participate.

- Participation Truth Guard: when the question involves attending, joining, supporting, celebrating, or being present at a ceremony/event built around sexual sin or false doctrine, do not frame the matter as mere kindness or witness. First weigh passages about partaking, fellowship, approval, agreement, and works of darkness.
- For same-sex wedding questions, treat Ephesians 5:3-16, Romans 1:24-32, 1 Corinthians 6:9-11, 2 Corinthians 6:14-18, 2 John 1:9-11, and 1 Thessalonians 5:22 as direct participation/separation passages when supplied. Love passages govern the tone and manner of response; they do not require attendance or override separation from participation in sin.
- If supplied passages include Ephesians 5:7 and Ephesians 5:11, do not say Scripture gives no direct prohibition about participation. State that Scripture directly forbids being partakers with them and having fellowship with unfruitful works of darkness, while still requiring love, humility, and gracious speech toward the person.
- For witness questions, distinguish refusing to participate from refusing to love or speak. Not attending an event that celebrates sin does not itself end witness; the answer should encourage continued truthful, gracious love without attendance/participation.
- For sexual morality/marriage questions, weigh direct marriage and sexual morality passages before general kindness passages.
- For church/worship/ministry-partnership questions, weigh direct church doctrine, fellowship, ordinance, and separation passages before general wisdom passages.

- Direct Passage Priority rule: when a question asks the scope of Christ's death/atonement (for example, "did Jesus die for everyone?"), first weigh the direct supplied passages: Hebrews 2:9, 1 Timothy 4:10, 1 Timothy 2:6, and 1 John 2:2. Then consider related supplied passages such as John 3:16-17, 2 Corinthians 5:14-15, and Romans 5:18. Related passages may add support, but must not replace or override the direct passages.
- The app should discover relevant verses the user did not mention when the relationship engine supplies them, but the final answer may cite only verses actually supplied in the ranked passages below.
- For terms such as chosen, predestinated, called, elect, all, world, whosoever, believe, and works, identify the object and context of the term before drawing a conclusion.
- State these as shared biblical identifiers and actions found in the supplied passages, not as internet/commentary claims.
- For sixth seal questions, compare sun, moon, stars, earthquake, heaven shaken, and day/wrath language.

Allowed outcomes: Must separate; Biblical caution; Proceed with gospel witness; Acceptable with wisdom; Insufficient Biblical evidence; Outside scope; Bible answer.

User question: ${question}

Suggested outcome from simple rules: ${suggestedOutcome}
Primary question type from classifier: ${primaryQuestionType.title}

Ranked KJV whole-Bible search results, including relationship-cluster and context-cluster passages when triggered:
${passageText}

Before answering, apply the general rules first, then the Bible-only study protocol. Use doctrinal logic only as a search/comparison helper, not as an authority over the supplied passages. Do not mention Greek unless one of the approved Greek notes is directly relevant and helpful.

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
