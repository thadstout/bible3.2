const biblePassages = require('./allBooks.js');

/*
  Biblical Relationship Engine
  Purpose: help the app find related passages by repeated biblical markers.
  This file is not a commentary layer and does not force conclusions.
  It supplies passage clusters for comparison, then the answer must still come
  only from the supplied KJV passages.
*/

const RELATIONSHIPS = [
  {
    id: 'end_times_opponent_cluster',
    title: 'End-times opponent textual relationship cluster',
    triggers: [
      'antichrist','beast','little horn','man of sin','son of perdition','wicked one','wicked','prince that shall come','abomination of desolation','false prophet','mark of the beast','image of the beast','buy','sell','right hand','forehead','ten horns','great words','blasphemy','blasphemies','war with the saints','wear out the saints','overcome the saints','42 months','forty two months','time times half','time times and half','half a time','1260 days','thousand two hundred and threescore'
    ],
    markers: [
      'ruler/opponent title language: antichrist, little horn, beast, man of sin, son of perdition, wicked one',
      'self-exaltation or speaking against God',
      'great words, blasphemy, or opposition to God',
      'deception, lying wonders, image/mark worship, or global religious pressure',
      'war with saints, overcoming saints, wearing out saints, or martyrdom',
      'limited duration markers: time-times-half-a-time, 42 months, 1260 days',
      'judgment or destruction by Christ/God'
    ],
    refs: [
      'Daniel 7:7','Daniel 7:8','Daniel 7:11','Daniel 7:20','Daniel 7:21','Daniel 7:23','Daniel 7:24','Daniel 7:25','Daniel 7:26','Daniel 7:27',
      'Daniel 8:23','Daniel 8:24','Daniel 8:25','Daniel 9:26','Daniel 9:27','Daniel 11:36','Daniel 11:37','Daniel 11:38','Daniel 11:39','Daniel 11:40','Daniel 12:7','Daniel 12:11','Daniel 12:12',
      'Matthew 24:15','Matthew 24:21','Matthew 24:22','Matthew 24:24',
      '2 Thessalonians 2:3','2 Thessalonians 2:4','2 Thessalonians 2:5','2 Thessalonians 2:6','2 Thessalonians 2:7','2 Thessalonians 2:8','2 Thessalonians 2:9','2 Thessalonians 2:10','2 Thessalonians 2:11','2 Thessalonians 2:12',
      '1 John 2:18','1 John 2:22','1 John 4:3','2 John 1:7',
      'Revelation 11:2','Revelation 11:3','Revelation 12:6','Revelation 12:14',
      'Revelation 13:1','Revelation 13:2','Revelation 13:3','Revelation 13:4','Revelation 13:5','Revelation 13:6','Revelation 13:7','Revelation 13:8','Revelation 13:11','Revelation 13:12','Revelation 13:13','Revelation 13:14','Revelation 13:15','Revelation 13:16','Revelation 13:17','Revelation 13:18',
      'Revelation 14:9','Revelation 14:10','Revelation 14:11','Revelation 15:2','Revelation 16:2','Revelation 17:12','Revelation 17:13','Revelation 17:14','Revelation 19:19','Revelation 19:20','Revelation 20:4'
    ],
    instruction: 'Compare these passages by repeated textual markers. Do not assert identity merely because a title appears. State only what the supplied verses show: shared descriptions, shared actions, shared duration markers, and shared judgment language.'
  },
  {
    id: 'abomination_apostasy_deception_cluster',
    title: 'Apostasy / abomination / deception event cluster',
    triggers: ['falling away','apostasy','depart from the faith','abomination','abomination of desolation','temple of god','deceive','deception','lying wonders','strong delusion','false christs','false prophets'],
    markers: [
      'departure/falling away language',
      'abomination or temple-related language',
      'deception, false christs/prophets, lying wonders, or strong delusion',
      'tribulation or end-time warning context'
    ],
    refs: [
      'Daniel 9:27','Daniel 11:31','Daniel 12:11',
      'Matthew 24:4','Matthew 24:5','Matthew 24:11','Matthew 24:15','Matthew 24:21','Matthew 24:24','Mark 13:14','Mark 13:22',
      '2 Thessalonians 2:3','2 Thessalonians 2:4','2 Thessalonians 2:8','2 Thessalonians 2:9','2 Thessalonians 2:10','2 Thessalonians 2:11','2 Thessalonians 2:12',
      '1 Timothy 4:1','1 Timothy 4:2','2 Timothy 3:1','2 Timothy 3:5','2 Timothy 4:3','2 Timothy 4:4',
      'Revelation 13:13','Revelation 13:14','Revelation 16:13','Revelation 16:14','Revelation 19:20'
    ],
    instruction: 'Compare apostasy, abomination, and deception passages as event markers. Do not import a prophetic chart; only identify the shared biblical markers found in the supplied verses.'
  },
  {
    id: 'cosmic_day_of_lord_cluster',
    title: 'Cosmic disturbance / day of the Lord relationship cluster',
    triggers: ['sixth seal','sun darkened','moon blood','moon darkened','stars fall','stars of heaven','earthquake','heaven departed','heavens shaken','day of the lord','wrath of the lamb','great day of his wrath'],
    markers: [
      'sun darkened or blackened',
      'moon turned to blood or darkened',
      'stars falling / heavenly shaking',
      'great earthquake / earth shaking',
      'day of the Lord or wrath language'
    ],
    refs: [
      'Isaiah 13:9','Isaiah 13:10','Isaiah 13:13','Isaiah 34:4','Ezekiel 32:7','Ezekiel 32:8','Joel 2:10','Joel 2:30','Joel 2:31','Joel 3:15','Haggai 2:6','Haggai 2:21',
      'Matthew 24:29','Mark 13:24','Mark 13:25','Luke 21:25','Luke 21:26','Acts 2:19','Acts 2:20','Hebrews 12:26','Hebrews 12:27',
      'Revelation 6:12','Revelation 6:13','Revelation 6:14','Revelation 6:15','Revelation 6:16','Revelation 6:17'
    ],
    instruction: 'Compare cosmic signs as repeated event markers. Do not force timing beyond what the supplied passages establish.'
  },
  {
    id: 'salvation_whole_counsel_cluster',
    title: 'Salvation whole-counsel relationship cluster',
    triggers: ['salvation','saved','choose','chooses','chosen','elect','election','predestinated','predestination','foreknow','foreknowledge','called','calling','heaven','hell','eternal life','everlasting life','condemnation','whosoever','believe','faith','grace','works','book of life'],
    markers: [
      'God’s saving desire and provision',
      'human responsibility to believe/call/come',
      'grace, faith, and not-of-works passages',
      'chosen/elect/predestinated language with object and context checked',
      'condemnation/judgment passages',
      'security/eternal life passages',
      'gospel invitation passages'
    ],
    refs: [
      'Ezekiel 18:23','Ezekiel 18:32','Ezekiel 33:11','Isaiah 55:1','Isaiah 55:6','Isaiah 55:7',
      'John 1:12','John 1:13','John 3:15','John 3:16','John 3:17','John 3:18','John 3:36','John 5:24','John 6:37','John 6:40','John 6:47','John 10:27','John 10:28','John 10:29','John 12:32',
      'Acts 2:21','Acts 4:12','Acts 10:34','Acts 10:35','Acts 16:30','Acts 16:31','Acts 17:30','Acts 17:31',
      'Romans 3:21','Romans 3:22','Romans 3:23','Romans 3:24','Romans 3:28','Romans 4:3','Romans 4:5','Romans 5:1','Romans 5:6','Romans 5:8','Romans 5:18','Romans 6:23','Romans 8:28','Romans 8:29','Romans 8:30','Romans 8:31','Romans 8:32','Romans 8:33','Romans 8:34','Romans 8:35','Romans 8:38','Romans 8:39','Romans 9:11','Romans 9:15','Romans 9:16','Romans 9:18','Romans 10:9','Romans 10:10','Romans 10:11','Romans 10:12','Romans 10:13','Romans 10:14','Romans 10:17','Romans 11:5','Romans 11:6',
      '1 Corinthians 15:1','1 Corinthians 15:2','1 Corinthians 15:3','1 Corinthians 15:4','2 Corinthians 5:14','2 Corinthians 5:15','2 Corinthians 5:19','Galatians 2:16','Galatians 3:22','Galatians 3:26',
      'Ephesians 1:4','Ephesians 1:5','Ephesians 1:6','Ephesians 1:7','Ephesians 1:11','Ephesians 1:12','Ephesians 1:13','Ephesians 1:14','Ephesians 2:8','Ephesians 2:9','Ephesians 2:10',
      '1 Timothy 2:3','1 Timothy 2:4','1 Timothy 2:5','1 Timothy 2:6','Titus 3:5','Titus 3:7','Hebrews 2:9','Hebrews 7:25','2 Peter 3:9','1 John 2:2','1 John 5:11','1 John 5:12','1 John 5:13','Revelation 20:12','Revelation 20:15','Revelation 22:17'
    ],
    instruction: 'For salvation questions, do not build doctrine from isolated vocabulary. Gather the whole-counsel cluster and compare categories before answering. Define terms by immediate context and object: chosen to what, predestinated to what, called to what, all/world/whosoever in what scope.'
  }
];

function normalize(str) {
  return String(str || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9:\-\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function getTriggeredRelationships(question, passages = []) {
  const q = normalize(question);
  const passageText = normalize(passages.map(p => `${p.ref || ''} ${p.text || ''}`).join(' '));
  const haystack = `${q} ${passageText}`;
  return RELATIONSHIPS.filter(rel => rel.triggers.some(t => haystack.includes(normalize(t))));
}

function getRelationshipRefs(question, passages = []) {
  const rels = getTriggeredRelationships(question, passages);
  return new Set(rels.flatMap(r => r.refs));
}

function getRelationshipPassages(question, passages = [], limit = 35) {
  const rels = getTriggeredRelationships(question, passages);
  if (!rels.length) return [];
  const refs = rels.flatMap(r => r.refs);
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

function getRelationshipInstructions(question, passages = []) {
  const rels = getTriggeredRelationships(question, passages);
  if (!rels.length) return 'No Biblical relationship cluster was triggered.';
  return rels.map(r => `BIBLICAL RELATIONSHIP ENGINE: ${r.title}\nRepeated markers to compare: ${r.markers.join('; ')}.\nInstruction: ${r.instruction}`).join('\n\n');
}

module.exports = {
  RELATIONSHIPS,
  getTriggeredRelationships,
  getRelationshipRefs,
  getRelationshipPassages,
  getRelationshipInstructions
};
