const biblePassages = require('./allBooks.js');

/*
  Bible Answers 4.4 Biblical Question Classifier
  Purpose: identify the kind of question being asked before relationship clusters run.
  This is not a doctrine authority. It is a routing/study helper so the app searches
  the most direct passages first and does not let a secondary theme override the main issue.
*/

function normalize(s) {
  return String(s || '').toLowerCase().replace(/[“”]/g, '"').replace(/[’]/g, "'");
}

function includesAny(q, terms) {
  return terms.some(t => q.includes(t));
}

const CLASSIFIERS = [
  {
    id: 'participation_separation',
    title: 'Participation / fellowship / separation question',
    priority: 100,
    triggers: [
      'can i go', 'should i go', 'may i go', 'is it ok to go', 'is it okay to go',
      'attend', 'invited to', 'invitation', 'wedding', 'ceremony', 'celebrate', 'celebration',
      'support', 'show support', 'participate', 'join', 'partner', 'fellowship', 'agree with',
      'unequally yoked', 'separate', 'separation', 'company', 'keep company', 'receive him',
      'bid him god speed', 'appearance of evil', 'works of darkness'
    ],
    strongPairs: [
      ['gay', 'wedding'], ['homosexual', 'wedding'], ['same sex', 'wedding'], ['same-sex', 'wedding'],
      ['trans', 'wedding'], ['sin', 'celebrate'], ['sin', 'support'], ['false doctrine', 'meeting'],
      ['works salvation', 'church'], ['joint', 'service'], ['join', 'meeting']
    ],
    primaryIssue: 'The primary issue is not whether to love the person. The primary issue is whether attendance/participation communicates fellowship, approval, partnership, or celebration of something Scripture identifies as sin or false doctrine.',
    refs: [
      'Genesis 2:24','Matthew 19:4','Matthew 19:5','Matthew 19:6',
      'Romans 1:24','Romans 1:25','Romans 1:26','Romans 1:27','Romans 1:28','Romans 1:32',
      '1 Corinthians 6:9','1 Corinthians 6:10','1 Corinthians 6:11','1 Corinthians 6:18','1 Corinthians 6:19','1 Corinthians 6:20',
      '2 Corinthians 6:14','2 Corinthians 6:15','2 Corinthians 6:16','2 Corinthians 6:17','2 Corinthians 6:18',
      'Ephesians 5:3','Ephesians 5:4','Ephesians 5:5','Ephesians 5:6','Ephesians 5:7','Ephesians 5:8','Ephesians 5:9','Ephesians 5:10','Ephesians 5:11','Ephesians 5:12','Ephesians 5:13','Ephesians 5:14','Ephesians 5:15','Ephesians 5:16',
      '1 Corinthians 10:20','1 Corinthians 10:21','1 Corinthians 10:23','1 Corinthians 10:31',
      '2 John 1:9','2 John 1:10','2 John 1:11',
      'Amos 3:3','Psalm 1:1','1 Thessalonians 5:22',
      'Ephesians 4:15','Colossians 4:6','Jude 1:22','Jude 1:23'
    ],
    instruction: `Classify as participation/separation when the user asks whether to attend, join, celebrate, support, partner with, or show love by presence at an event. Search and weigh participation/fellowship/separation passages before general love/kindness passages. Love remains required, but love must be governed by truth and must not be used to justify fellowship with, partaking in, approving, or celebrating sin. For sexual-immorality participation questions, treat Ephesians 5:3-16 as direct-priority context: the passage names fornication/uncleanness, says be not partakers with them, commands believers to walk as children of light, prove what is acceptable unto the Lord, and have no fellowship with the unfruitful works of darkness. Do not answer merely from kindness/mercy verses if the question asks about attendance or participation. Do not conclude 'Scripture does not directly prohibit' when supplied direct passages establish non-participation/fellowship with works of darkness.`
  },

  {
    id: 'creation_order_identity',
    title: 'Creation order / male-female identity question',
    priority: 88,
    triggers: [
      'trans', 'transgender', 'gender identity', 'gender dysphoria', 'nonbinary', 'non-binary',
      'change gender', 'change sex', 'born a boy', 'born a girl', 'identify as', 'identifies as',
      'male and female', 'man and woman', 'woman trapped', 'man trapped', 'pronouns', 'call him her', 'call her him'
    ],
    strongPairs: [
      ['trans', 'lifestyle'], ['transgender', 'lifestyle'], ['trans', 'wrong'], ['transgender', 'wrong'],
      ['trans', 'condemn'], ['transgender', 'condemn'], ['gender', 'identity'], ['male', 'female']
    ],
    primaryIssue: 'The primary issue is not whether Scripture uses a modern label. The primary issue is what Scripture establishes about God creating mankind male and female, and whether a person should reject, alter, or present contrary to that God-created distinction.',
    refs: [
      'Genesis 1:26','Genesis 1:27','Genesis 5:1','Genesis 5:2',
      'Matthew 19:4','Matthew 19:5','Matthew 19:6','Mark 10:6','Mark 10:7','Mark 10:8','Mark 10:9',
      'Deuteronomy 22:5',
      '1 Corinthians 6:19','1 Corinthians 6:20',
      'Romans 1:24','Romans 1:25','Romans 1:26','Romans 1:27',
      'Psalm 139:13','Psalm 139:14','Isaiah 45:9','Isaiah 45:10','Isaiah 45:11','Isaiah 45:12'
    ],
    instruction: 'Classify as creation order / male-female identity when a question uses modern terms such as transgender, trans, gender identity, changing sex/gender, pronouns tied to sex, or rejecting/presenting contrary to biological sex. Do not answer merely that Scripture does not mention the modern term. First gather creation-order passages about God making mankind male and female. Treat Deuteronomy 22:5 as a supporting passage about maintaining male/female distinction, not as the only or primary text. Consider body-stewardship passages such as 1 Corinthians 6:19-20 when supplied. Answer from what the supplied passages establish, and distinguish the absence of a modern word from the presence of biblical doctrine.'
  },
  {
    id: 'salvation_definition',
    title: 'Salvation / election / gospel definition question',
    priority: 90,
    triggers: [
      'salvation','saved','save','heaven','hell','gospel','born again','eternal life','everlasting life',
      'chosen','choose','elect','election','predestinated','predestination','foreknow','foreknowledge',
      'grace','faith','believe','works','justified','justification','atonement','propitiation',
      'did jesus die','did christ die','died for all','died for everyone','ransom for all','whole world',
      'tulip','calvinism','arminianism','limited atonement','unconditional election'
    ],
    primaryIssue: 'The primary issue is salvation/gospel doctrine. Do not let prophecy, participation, or general wisdom clusters override the salvation context.',
    refs: [
      'John 3:15','John 3:16','John 3:17','John 3:18','John 3:36','John 5:24','John 6:40','John 6:47',
      'Acts 16:30','Acts 16:31','Romans 3:22','Romans 3:23','Romans 3:24','Romans 3:28','Romans 4:5','Romans 5:1','Romans 10:9','Romans 10:10','Romans 10:13',
      'Ephesians 2:8','Ephesians 2:9','Ephesians 2:10','Titus 3:5','1 Timothy 2:4','1 Timothy 2:5','1 Timothy 2:6','1 Timothy 4:10','Hebrews 2:9','1 John 2:2','Revelation 22:17'
    ],
    instruction: 'Classify as salvation when the user asks about heaven, hell, gospel, election, predestination, faith, works, atonement, or theological labels like TULIP. Gather direct salvation passages first. Do not answer from isolated vocabulary. Do not trigger prophecy clusters unless the question itself asks about prophecy.'
  },
  {
    id: 'prophecy_end_times',
    title: 'Prophecy / end-times relationship question',
    priority: 80,
    triggers: [
      'prophecy','revelation','daniel','antichrist','beast','little horn','man of sin','son of perdition',
      'mark of the beast','image of the beast','abomination of desolation','tribulation','second coming',
      'day of the lord','sixth seal','sun darkened','moon','stars','42 months','1260','time times'
    ],
    primaryIssue: 'The primary issue is prophecy/end-times. Relationship clusters may compare shared prophetic markers, but still may not force conclusions beyond the supplied passages.',
    refs: [
      'Daniel 7:8','Daniel 7:21','Daniel 7:25','Daniel 9:27','Daniel 12:7',
      'Matthew 24:15','Matthew 24:21','Matthew 24:24','Matthew 24:29',
      '2 Thessalonians 2:3','2 Thessalonians 2:4','2 Thessalonians 2:8','2 Thessalonians 2:9','2 Thessalonians 2:10',
      'Revelation 6:12','Revelation 6:13','Revelation 6:17','Revelation 13:1','Revelation 13:5','Revelation 13:7','Revelation 13:16','Revelation 13:17','Revelation 19:20'
    ],
    instruction: 'Classify as prophecy only when the user question itself asks about prophecy/end-times entities or events. Compare repeated textual markers, not outside systems.'
  },
  {
    id: 'marriage_family',
    title: 'Marriage / family / sexual morality question',
    priority: 75,
    triggers: ['marriage','marry','wedding','husband','wife','divorce','adultery','fornication','homosexual','gay','lesbian','sodomy','sexual','sex','transgender','gender'],
    primaryIssue: 'The primary issue involves marriage, family, gender, or sexual morality. Gather creation/marriage and sexual morality passages. If the question also asks about attending/supporting an event, participation/separation takes priority.',
    refs: [
      'Genesis 1:27','Genesis 2:24','Matthew 19:4','Matthew 19:5','Matthew 19:6','Romans 1:26','Romans 1:27','1 Corinthians 6:9','1 Corinthians 6:10','1 Corinthians 6:11','1 Corinthians 6:18','Hebrews 13:4','Ephesians 5:22','Ephesians 5:23','Ephesians 5:25','Ephesians 5:31','Ephesians 5:32'
    ],
    instruction: 'Classify as marriage/sexual morality when the question concerns marriage, gender, or sexual conduct. Do not reduce the answer to general love passages when direct sexual morality or marriage passages are supplied.'
  },
  {
    id: 'worship_church',
    title: 'Church / worship / ministry partnership question',
    priority: 70,
    triggers: ['church','worship','service','communion','lord\'s supper','baptism','preaching','pastor','youth pastor','ministry','joint service','outreach','fellowship meeting'],
    primaryIssue: 'The primary issue involves church practice, worship, doctrine, or ministry partnership.',
    refs: [
      'Acts 2:41','Acts 2:42','1 Corinthians 11:23','1 Corinthians 11:24','1 Corinthians 11:25','1 Corinthians 11:26','1 Corinthians 11:27','1 Corinthians 11:28','1 Corinthians 11:29','Romans 16:17','2 Thessalonians 3:6','2 John 1:9','2 John 1:10','2 John 1:11','1 Timothy 3:15','2 Timothy 4:2','2 Timothy 4:3','2 Timothy 4:4'
    ],
    instruction: 'Classify as church/worship when the question concerns a church, worship act, ordinance, doctrine, or ministry partnership. Search direct church-practice passages before general wisdom passages.'
  }
];

function scoreClassifier(c, q) {
  let score = 0;
  for (const t of c.triggers || []) {
    if (q.includes(normalize(t))) score += 1;
  }
  for (const pair of c.strongPairs || []) {
    if (pair.every(t => q.includes(normalize(t)))) score += 5;
  }
  if (score > 0) score += c.priority / 100;
  return score;
}

function classifyQuestionType(question) {
  const q = normalize(question);
  const scored = CLASSIFIERS.map(c => ({ ...c, score: scoreClassifier(c, q) }))
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score || b.priority - a.priority);
  return scored;
}

function getPrimaryQuestionType(question) {
  const matches = classifyQuestionType(question);
  return matches[0] || {
    id: 'general_bible_answer',
    title: 'General Bible answer',
    primaryIssue: 'No special classifier was triggered. Use standard Bible-only search and context rules.',
    refs: [],
    instruction: 'Use direct Scripture search results and do not force a specialized relationship cluster.'
  };
}

function getClassifierPassages(question, limit = 35) {
  const primary = getPrimaryQuestionType(question);
  const byRef = new Map(biblePassages.map(p => [p.ref, p]));
  const out = [];
  const seen = new Set();
  for (const ref of primary.refs || []) {
    const p = byRef.get(ref);
    if (p && !seen.has(ref)) {
      out.push(p);
      seen.add(ref);
    }
    if (out.length >= limit) break;
  }
  return out;
}

function getClassifierInstructions(question) {
  const matches = classifyQuestionType(question);
  const primary = getPrimaryQuestionType(question);
  const secondary = matches.slice(1, 4).map(m => m.title).join('; ') || 'none';
  return `BIBLICAL QUESTION CLASSIFIER 4.4\nPrimary question type: ${primary.title}\nPrimary issue: ${primary.primaryIssue}\nRouting instruction: ${primary.instruction}\nSecondary themes detected: ${secondary}\nRule: The primary question type controls search priority. Secondary themes may add balance, but they must not override direct passages for the primary issue.`;
}

module.exports = {
  CLASSIFIERS,
  classifyQuestionType,
  getPrimaryQuestionType,
  getClassifierPassages,
  getClassifierInstructions
};
