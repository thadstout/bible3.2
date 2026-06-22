const biblePassages = require('./allBooks.js');

/*
  Context Relationship Engine
  Purpose: help the app study doctrinal words in their surrounding biblical context.
  This is not a commentary layer. It does not define doctrine by a human system.
  It only supplies direct context passages and study cautions so the final answer
  remains based on the supplied KJV passages.
*/

function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9:\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function includesAny(q, terms) {
  return terms.some(t => q.includes(normalize(t)));
}

const CONTEXT_CLUSTERS = [
  {
    id: 'in_christ_in_him_context',
    title: 'In Christ / In Him context relationship',
    domain: 'salvation',
    triggers: [
      'in him','in christ','in whom','in the beloved','accepted in the beloved','chosen in him','blessed us','spiritual blessings','redemption through his blood','sealed','earnest','inheritance','adoption','predestinated','chosen','elect'
    ],
    refs: [
      'Ephesians 1:3','Ephesians 1:4','Ephesians 1:5','Ephesians 1:6','Ephesians 1:7','Ephesians 1:8','Ephesians 1:9','Ephesians 1:10','Ephesians 1:11','Ephesians 1:12','Ephesians 1:13','Ephesians 1:14',
      'Ephesians 2:4','Ephesians 2:5','Ephesians 2:6','Ephesians 2:7','Ephesians 2:8','Ephesians 2:9','Ephesians 2:10','Ephesians 2:13','Ephesians 2:18','Ephesians 2:19','Ephesians 2:20','Ephesians 2:21','Ephesians 2:22',
      'Romans 8:1','Romans 8:28','Romans 8:29','Romans 8:30','Romans 8:31','Romans 8:32','Romans 8:33','Romans 8:34','Romans 8:35','Romans 8:38','Romans 8:39',
      '2 Corinthians 5:17','2 Corinthians 5:18','2 Corinthians 5:19','2 Corinthians 5:20','2 Corinthians 5:21',
      'Galatians 3:26','Galatians 3:27','Galatians 3:28','Galatians 3:29',
      'Colossians 1:12','Colossians 1:13','Colossians 1:14','Colossians 1:18','Colossians 1:19','Colossians 1:20','Colossians 1:21','Colossians 1:22',
      'Colossians 2:9','Colossians 2:10','Colossians 2:11','Colossians 2:12','Colossians 2:13'
    ],
    instruction: 'When the question involves chosen/elect/predestinated/sealed/inheritance/adoption language, first observe the immediate “in Christ / in Him / in whom” context. Ask: Who is in Christ? What blessing is being described in Christ? What does the text say the person or group is chosen/predestinated/sealed unto? Do not infer an object that the sentence does not state.'
  },
  {
    id: 'election_predestination_context',
    title: 'Election / predestination context relationship',
    domain: 'salvation',
    triggers: ['choose','chooses','chosen','elect','election','predestinate','predestinated','predestination','foreknow','foreknowledge','called','calling','purpose'],
    refs: [
      'Ephesians 1:3','Ephesians 1:4','Ephesians 1:5','Ephesians 1:6','Ephesians 1:11','Ephesians 1:12','Ephesians 1:13','Ephesians 1:14',
      'Romans 8:28','Romans 8:29','Romans 8:30','Romans 8:31','Romans 8:32','Romans 8:33','Romans 8:34',
      'Romans 9:10','Romans 9:11','Romans 9:12','Romans 9:13','Romans 9:14','Romans 9:15','Romans 9:16','Romans 9:17','Romans 9:18','Romans 9:19','Romans 9:20','Romans 9:21','Romans 9:22','Romans 9:23','Romans 9:24','Romans 9:25','Romans 9:26','Romans 9:30','Romans 9:31','Romans 9:32','Romans 9:33',
      'Romans 10:9','Romans 10:10','Romans 10:11','Romans 10:12','Romans 10:13','Romans 10:14','Romans 10:17','Romans 10:21',
      'Romans 11:5','Romans 11:6','Romans 11:7','Romans 11:28','Romans 11:29','Romans 11:32','Romans 11:33',
      '1 Peter 1:1','1 Peter 1:2','2 Thessalonians 2:13','2 Thessalonians 2:14','John 15:16','1 Corinthians 1:26','1 Corinthians 1:27','1 Corinthians 1:28','1 Corinthians 1:29','1 Corinthians 1:30','1 Corinthians 1:31'
    ],
    instruction: 'Treat election/predestination/calling words by context. Ask “chosen to what?”, “predestinated to what?”, “called by what means?”, “who is being addressed?”, and “what problem is the paragraph answering?” Compare Romans 8, Romans 9-11, Ephesians 1, 1 Peter 1, and 2 Thessalonians 2 without letting one vocabulary family cancel the others.'
  },
  {
    id: 'grace_faith_works_context',
    title: 'Grace / faith / works context relationship',
    domain: 'salvation',
    triggers: ['grace','faith','believe','belief','works','saved by works','not of works','law','justified','justification','righteousness','imputed','repent','repentance'],
    refs: [
      'John 3:15','John 3:16','John 3:17','John 3:18','John 3:36','John 5:24','John 6:28','John 6:29','John 6:40','John 6:47',
      'Acts 16:30','Acts 16:31','Acts 17:30','Acts 20:21',
      'Romans 3:19','Romans 3:20','Romans 3:21','Romans 3:22','Romans 3:23','Romans 3:24','Romans 3:25','Romans 3:26','Romans 3:27','Romans 3:28','Romans 3:29','Romans 3:30','Romans 3:31',
      'Romans 4:1','Romans 4:2','Romans 4:3','Romans 4:4','Romans 4:5','Romans 4:6','Romans 4:7','Romans 4:8','Romans 4:16','Romans 5:1','Romans 5:2','Romans 5:6','Romans 5:8','Romans 5:18',
      'Romans 10:9','Romans 10:10','Romans 10:11','Romans 10:12','Romans 10:13','Romans 10:17',
      'Galatians 2:16','Galatians 2:20','Galatians 2:21','Galatians 3:22','Galatians 3:23','Galatians 3:24','Galatians 3:25','Galatians 3:26',
      'Ephesians 2:8','Ephesians 2:9','Ephesians 2:10','Titus 3:5','Titus 3:6','Titus 3:7','James 2:14','James 2:17','James 2:18','James 2:20','James 2:24','James 2:26'
    ],
    instruction: 'For grace/faith/works questions, gather the direct salvation-by-grace-through-faith passages and then compare passages about works in their own context. Do not make James or Paul cancel the other. Ask whether the passage is discussing the basis of justification before God, evidence/profit of faith, law-keeping, or Christian walk.'
  },
  {
    id: 'hebrews_salvation_context',
    title: 'Hebrews warning / sacrifice / security context relationship',
    domain: 'salvation',
    triggers: ['hebrews','lose salvation','fall away','falling away','impossible to renew','wilful sin','willful sin','once for all','sacrifice','blood','covenant','perfection','endure','draw back','saved forever','intercession'],
    refs: [
      'Hebrews 2:9','Hebrews 2:10','Hebrews 2:14','Hebrews 2:15','Hebrews 2:17','Hebrews 2:18',
      'Hebrews 4:14','Hebrews 4:15','Hebrews 4:16','Hebrews 5:8','Hebrews 5:9',
      'Hebrews 6:1','Hebrews 6:4','Hebrews 6:5','Hebrews 6:6','Hebrews 6:7','Hebrews 6:8','Hebrews 6:9','Hebrews 6:10','Hebrews 6:11','Hebrews 6:12','Hebrews 6:17','Hebrews 6:18','Hebrews 6:19','Hebrews 6:20',
      'Hebrews 7:25','Hebrews 7:26','Hebrews 7:27','Hebrews 8:6','Hebrews 8:10','Hebrews 8:12',
      'Hebrews 9:12','Hebrews 9:14','Hebrews 9:15','Hebrews 9:22','Hebrews 9:26','Hebrews 9:28',
      'Hebrews 10:10','Hebrews 10:11','Hebrews 10:12','Hebrews 10:14','Hebrews 10:16','Hebrews 10:17','Hebrews 10:18','Hebrews 10:19','Hebrews 10:26','Hebrews 10:27','Hebrews 10:28','Hebrews 10:29','Hebrews 10:30','Hebrews 10:31','Hebrews 10:38','Hebrews 10:39'
    ],
    instruction: 'For Hebrews questions, keep warning passages in the same conversation with Christ’s priesthood, once-for-all sacrifice, anchor/hope, better covenant, and the writer’s distinction in Hebrews 6:9 and Hebrews 10:39. Do not answer from the warning vocabulary alone without the immediate and book context.'
  },
  {
    id: 'law_command_context',
    title: 'Law / command / covenant context relationship',
    domain: 'general',
    triggers: ['law','command','commandment','statute','judgment','ordinance','old testament law','moral law','civil law','ceremonial law','national law','sabbath','dietary','circumcision','sacrifice','clean','unclean'],
    refs: [
      'Matthew 5:17','Matthew 5:18','Matthew 5:19','Matthew 5:20','Matthew 22:36','Matthew 22:37','Matthew 22:38','Matthew 22:39','Matthew 22:40',
      'Acts 15:5','Acts 15:10','Acts 15:19','Acts 15:20','Acts 15:28','Acts 15:29',
      'Romans 3:19','Romans 3:20','Romans 3:21','Romans 3:28','Romans 3:31','Romans 7:7','Romans 7:12','Romans 10:4','Romans 13:8','Romans 13:9','Romans 13:10',
      'Galatians 3:24','Galatians 3:25','Colossians 2:14','Colossians 2:16','Colossians 2:17','Hebrews 8:6','Hebrews 8:13','Hebrews 10:1','Hebrews 10:9','Hebrews 10:10'
    ],
    instruction: 'For law questions, classify Old Testament passages carefully as moral command, civil/judicial law, ceremonial law, national law for Israel, wisdom, prophecy, or narrative. Then compare New Testament teaching before applying the passage directly.'
  }
];

function detectContextDomain(question) {
  const q = normalize(question);
  const salvationTerms = ['salvation','saved','save','heaven','hell','eternal life','everlasting life','condemnation','gospel','grace','faith','believe','justified','justification','works','born again','book of life','choose','chosen','elect','election','predestinated','predestination','foreknow','foreknowledge','called','calling','atonement','propitiation','jesus die','christ die','died for all','died for everyone','ransom for all','whole world','hebrews','lose salvation','fall away'];
  const prophecyTerms = ['prophecy','revelation','daniel','antichrist','beast','little horn','tribulation','day of the lord','second coming','millennium','mark of the beast'];
  const lawTerms = ['law','command','commandment','statute','judgment','ordinance','old testament law','moral law','civil law','ceremonial law','national law','sabbath','circumcision','clean','unclean'];
  if (includesAny(q, prophecyTerms) && !includesAny(q, salvationTerms)) return 'prophecy';
  if (includesAny(q, salvationTerms)) return 'salvation';
  if (includesAny(q, lawTerms)) return 'general';
  return 'none';
}

function clusterAllowed(cluster, domain) {
  if (domain === 'none') return false;
  if (domain === 'salvation') return cluster.domain === 'salvation' || cluster.id === 'law_command_context';
  if (domain === 'general') return cluster.domain === 'general';
  return false;
}

function getTriggeredContextClusters(question) {
  const q = normalize(question);
  const domain = detectContextDomain(question);
  return CONTEXT_CLUSTERS.filter(c => clusterAllowed(c, domain) && c.triggers.some(t => q.includes(normalize(t))));
}

function getContextPassages(question, limit = 45) {
  const clusters = getTriggeredContextClusters(question);
  if (!clusters.length) return [];
  const refs = clusters.flatMap(c => c.refs);
  const byRef = new Map(biblePassages.map(p => [p.ref, p]));
  const out = [];
  const seen = new Set();
  for (const ref of refs) {
    const p = byRef.get(ref);
    if (p && !seen.has(ref)) {
      out.push(p);
      seen.add(ref);
    }
    if (out.length >= limit) break;
  }
  return out;
}

function getContextInstructions(question) {
  const clusters = getTriggeredContextClusters(question);
  if (!clusters.length) return 'No Context Relationship Engine cluster was triggered.';
  return clusters.map(c => `CONTEXT RELATIONSHIP ENGINE: ${c.title}\nInstruction: ${c.instruction}`).join('\n\n');
}

module.exports = {
  CONTEXT_CLUSTERS,
  getTriggeredContextClusters,
  getContextPassages,
  getContextInstructions
};
