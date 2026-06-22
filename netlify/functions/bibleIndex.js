const biblePassages = require('./allBooks.js');
const { getConnectionPassages } = require('./propheticConnections.js');

const stopWords = new Set([
  'the','a','an','and','or','but','is','are','was','were','to','of','in','on','for','with','my','me','i','it','that','this','can','should','do','does','be','as','at','from','if','what','about','have','has','had','will','would','could','there','their','they','them','his','her','him','he','she','we','us','you','your','our','not','so','then','than','into','unto','by','am'
]);

const synonymMap = {

  creation: ['created','made','heaven','earth','male','female','beginning'],
  law: ['commandment','statutes','judgments','ordinances','moses'],
  commandment: ['commandments','law','statutes','judgments','ordinances'],
  idolatry: ['idol','idols','image','graven','strange','gods'],
  sacrifice: ['offering','altar','blood','atonement','lamb'],
  prophecy: ['prophet','prophets','vision','day of the lord','messiah','sun','moon','stars','earthquake','wrath','shaken','heaven','beast','horn','saints','months'],
  beast: ['little horn','ten horns','great words','blasphemy','war with the saints','overcome the saints','42 months','forty two months'],
  horn: ['little horn','beast','ten horns','great words','war with the saints','time times half'],
  saints: ['war with the saints','wear out the saints','overcome the saints','beast','little horn'],
  months: ['42 months','forty two months','time times half','1260 days','thousand two hundred and threescore'],
  seal: ['seals','sixth seal','sun','moon','stars','earthquake','wrath','heaven'],
  sixth: ['sixth seal','seal','sun','moon','stars','earthquake','wrath','heaven'],
  earthquake: ['earthquakes','shaken','shake','tremble','sun','moon','stars','wrath'],
  sun: ['darkened','black','moon','stars','heaven','day of the lord'],
  moon: ['blood','darkened','sun','stars','heaven','day of the lord'],
  stars: ['fall','fallen','heaven','sun','moon','shaken'],
  messiah: ['christ','anointed','david','seed','king'],
  covenant: ['promise','promised','oath','seed','abraham'],
  worship: ['worshipped','praise','sing','psalm','sacrifice'],
  repentance: ['repent','turn','wicked','evil','forsake'],
  justice: ['judge','judgment','righteousness','poor','widow','fatherless'],
  salvation: ['saved','save','grace','faith','believe','gospel','justified','justification','redeemed','redemption','eternal','life'],
  saved: ['salvation','save','grace','faith','believe','gospel','justified','justification'],
  works: ['work','deeds','law','righteousness','boast','boasting','merit'],
  baptism: ['baptize','baptized','baptizing','water'],
  tongues: ['tongue','languages','interpretation','prophesy','spirit'],
  separate: ['separation','withdraw','avoid','fellowship','company','yoked','partaker','doctrine'],
  fellowship: ['company','partaker','yoked','communion','agreement','separate'],
  doctrine: ['teaching','gospel','truth','word','commandment'],
  false: ['deceive','deceiver','another','contrary','error','heresy'],
  church: ['assembly','brethren','body','fellowship','doctrine'],
  marriage: ['marry','wife','husband','fornication','adultery','one flesh'],
  dating: ['marry','marriage','unbeliever','yoked','fornication'],
  unbeliever: ['unbelieving','infidel','darkness','belial','yoked'],
  sin: ['iniquity','transgression','unrighteousness','evil','flesh'],
  sexual: ['fornication','adultery','uncleanness','lust','body'],
  homosexual: ['effeminate','abusers','natural','unnatural','vile','affections'],
  gender: ['male','female','creation','body'],
  wisdom: ['wise','understanding','discern','prove','knowledge'],
  music: ['song','sing','psalm','hymn','spiritual'],
  prayer: ['pray','praying','request','supplication'],
  forgive: ['forgiveness','forgiven','mercy','grace'],
  anger: ['wrath','bitterness','malice','forgive'],
  love: ['charity','beloved','brother','kindness'],
  money: ['mammon','riches','covetousness','content','gain'],
  alcohol: ['wine','drunkenness','sober'],
  communion: ['supper','bread','cup','body','blood','remembrance'],
  resurrection: ['risen','rise','raised','dead','life'],
  gospel: ['christ','cross','death','buried','rose','resurrection','faith','believe']
};

const bookAliases = {

  genesis: 'Genesis', gen: 'Genesis', ge: 'Genesis',
  exodus: 'Exodus', exod: 'Exodus', ex: 'Exodus',
  leviticus: 'Leviticus', lev: 'Leviticus', le: 'Leviticus',
  numbers: 'Numbers', num: 'Numbers', nu: 'Numbers',
  deuteronomy: 'Deuteronomy', deut: 'Deuteronomy', de: 'Deuteronomy',
  joshua: 'Joshua', josh: 'Joshua', jos: 'Joshua',
  judges: 'Judges', judg: 'Judges', jdg: 'Judges',
  ruth: 'Ruth', ru: 'Ruth',
  '1samuel': '1 Samuel', '1sam': '1 Samuel', '1sa': '1 Samuel', 'firstsamuel': '1 Samuel',
  '2samuel': '2 Samuel', '2sam': '2 Samuel', '2sa': '2 Samuel', 'secondsamuel': '2 Samuel',
  '1kings': '1 Kings', '1kgs': '1 Kings', '1ki': '1 Kings', 'firstkings': '1 Kings',
  '2kings': '2 Kings', '2kgs': '2 Kings', '2ki': '2 Kings', 'secondkings': '2 Kings',
  '1chronicles': '1 Chronicles', '1chron': '1 Chronicles', '1chr': '1 Chronicles', 'firstchronicles': '1 Chronicles',
  '2chronicles': '2 Chronicles', '2chron': '2 Chronicles', '2chr': '2 Chronicles', 'secondchronicles': '2 Chronicles',
  ezra: 'Ezra', ezr: 'Ezra',
  nehemiah: 'Nehemiah', neh: 'Nehemiah',
  esther: 'Esther', esth: 'Esther', est: 'Esther',
  job: 'Job',
  psalms: 'Psalms', psalm: 'Psalms', psa: 'Psalms', ps: 'Psalms',
  proverbs: 'Proverbs', prov: 'Proverbs', pro: 'Proverbs',
  ecclesiastes: 'Ecclesiastes', eccl: 'Ecclesiastes', ecc: 'Ecclesiastes',
  'songofsolomon': 'Song of Solomon', song: 'Song of Solomon', sos: 'Song of Solomon', canticles: 'Song of Solomon',
  isaiah: 'Isaiah', isa: 'Isaiah',
  jeremiah: 'Jeremiah', jer: 'Jeremiah',
  lamentations: 'Lamentations', lam: 'Lamentations',
  ezekiel: 'Ezekiel', ezek: 'Ezekiel', eze: 'Ezekiel',
  daniel: 'Daniel', dan: 'Daniel', da: 'Daniel',
  hosea: 'Hosea', hos: 'Hosea',
  joel: 'Joel',
  amos: 'Amos',
  obadiah: 'Obadiah', obad: 'Obadiah', ob: 'Obadiah',
  jonah: 'Jonah', jon: 'Jonah',
  micah: 'Micah', mic: 'Micah',
  nahum: 'Nahum', nah: 'Nahum',
  habakkuk: 'Habakkuk', hab: 'Habakkuk',
  zephaniah: 'Zephaniah', zeph: 'Zephaniah', zep: 'Zephaniah',
  haggai: 'Haggai', hag: 'Haggai',
  zechariah: 'Zechariah', zech: 'Zechariah', zec: 'Zechariah',
  malachi: 'Malachi', mal: 'Malachi',
  matthew: 'Matthew', matt: 'Matthew', mt: 'Matthew',
  mark: 'Mark', mrk: 'Mark', mk: 'Mark',
  luke: 'Luke', lk: 'Luke',
  john: 'John', jn: 'John',
  acts: 'Acts',
  romans: 'Romans', rom: 'Romans',
  '1corinthians': '1 Corinthians', '1cor': '1 Corinthians', '1co': '1 Corinthians', 'firstcorinthians': '1 Corinthians',
  '2corinthians': '2 Corinthians', '2cor': '2 Corinthians', '2co': '2 Corinthians', 'secondcorinthians': '2 Corinthians',
  galatians: 'Galatians', gal: 'Galatians',
  ephesians: 'Ephesians', eph: 'Ephesians',
  philippians: 'Philippians', phil: 'Philippians', php: 'Philippians',
  colossians: 'Colossians', col: 'Colossians',
  '1thessalonians': '1 Thessalonians', '1thess': '1 Thessalonians', '1th': '1 Thessalonians',
  '2thessalonians': '2 Thessalonians', '2thess': '2 Thessalonians', '2th': '2 Thessalonians',
  '1timothy': '1 Timothy', '1tim': '1 Timothy', '1ti': '1 Timothy',
  '2timothy': '2 Timothy', '2tim': '2 Timothy', '2ti': '2 Timothy',
  titus: 'Titus', philemon: 'Philemon', phm: 'Philemon',
  hebrews: 'Hebrews', heb: 'Hebrews',
  james: 'James', jas: 'James',
  '1peter': '1 Peter', '1pet': '1 Peter', '1pe': '1 Peter',
  '2peter': '2 Peter', '2pet': '2 Peter', '2pe': '2 Peter',
  '1john': '1 John', '1jn': '1 John',
  '2john': '2 John', '2jn': '2 John',
  '3john': '3 John', '3jn': '3 John',
  jude: 'Jude', revelation: 'Revelation', rev: 'Revelation'
};

function normalize(str) {
  return String(str || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function tokenize(input) {
  return normalize(input).split(' ').filter(w => w && !stopWords.has(w));
}

function expandTerms(words) {
  const terms = new Set(words);
  for (const word of words) {
    if (synonymMap[word]) synonymMap[word].forEach(t => terms.add(t));
  }
  return [...terms].filter(Boolean);
}

function parseReference(question) {
  const q = String(question || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9:\-\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const refMatch = q.match(/\b([1-3]?\s*[a-z]+)\s+(\d{1,3})(?::(\d{1,3})(?:\s*-\s*(\d{1,3}))?)?\b/);
  if (!refMatch) return null;
  const rawBook = refMatch[1].replace(/\s+/g, '');
  const book = bookAliases[rawBook];
  if (!book) return null;
  return {
    book,
    chapter: Number(refMatch[2]),
    verseStart: refMatch[3] ? Number(refMatch[3]) : null,
    verseEnd: refMatch[4] ? Number(refMatch[4]) : null
  };
}

function exactReferenceResults(ref, limit) {
  let results = biblePassages.filter(p => p.book === ref.book && p.chapter === ref.chapter);
  if (ref.verseStart) {
    const end = ref.verseEnd || ref.verseStart;
    results = results.filter(p => p.verse >= ref.verseStart && p.verse <= end);
    results = addNearbyContext(results, 1);
  }
  return results.slice(0, limit);
}

function addNearbyContext(results, radius = 1) {
  const wanted = new Set();
  for (const p of results) {
    for (let v = p.verse - radius; v <= p.verse + radius; v++) {
      wanted.add(`${p.book}|${p.chapter}|${v}`);
    }
  }
  const context = biblePassages.filter(p => wanted.has(`${p.book}|${p.chapter}|${p.verse}`));
  return dedupe(context);
}

function dedupe(passages) {
  const seen = new Set();
  const out = [];
  for (const p of passages) {
    const key = p.ref;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(p);
    }
  }
  return out;
}

function phraseScore(question, text, ref = "") {
  const q = normalize(question);
  const phrases = [];
  const quoted = [...String(question || '').matchAll(/[“"]([^”"]{3,})[”"]/g)].map(m => normalize(m[1]));
  phrases.push(...quoted);
  const importantPhrases = ['works salvation','saved by works','eternal life','false prophet','false teachers','another gospel','unequally yoked','not of works','communion','lords supper','body of christ','blood of christ','male and female','one flesh','fornication','love one another','sixth seal','sun darkened','moon became as blood','moon to blood','stars of heaven','great earthquake','day of the lord','day of his wrath','heaven departed','little horn','ten horns','great words','war with the saints','wear out the saints','overcome the saints','forty two months','42 months','time times half','half a time','thousand two hundred and threescore'];
  phrases.push(...importantPhrases.filter(p => q.includes(p)));
  let score = 0;
  for (const phrase of phrases) {
    if (phrase && text.includes(phrase)) score += 18;
  }


  // Prophetic identifier boost: connect Daniel 7 little horn with Revelation 13 beast by shared rare markers.
  if (/(little horn|beast|revelation 13|daniel 7|42 months|forty two months|1260 days|time times|half a time|war with the saints|wear out the saints|overcome the saints|ten horns|great words|blasphemy|blasphemies)/.test(q) && /^(Daniel 7:7|Daniel 7:8|Daniel 7:11|Daniel 7:20|Daniel 7:21|Daniel 7:23|Daniel 7:24|Daniel 7:25|Daniel 7:26|Daniel 7:27|Daniel 12:7|Daniel 12:11|Daniel 12:12|Revelation 11:2|Revelation 11:3|Revelation 12:6|Revelation 12:14|Revelation 13:1|Revelation 13:2|Revelation 13:5|Revelation 13:6|Revelation 13:7|Revelation 13:8|Revelation 17:12|Revelation 17:13|Revelation 17:14)/.test(ref)) score += 40;

  if (/(creation|created|beginning|male|female|marriage|one flesh|gender)/.test(q) && /^(Genesis 1:|Genesis 2:|Malachi 2:)/.test(ref)) score += 12;
  if (/(law|commandment|statute|judgment|ordinance|sabbath|clean|unclean)/.test(q) && /^(Exodus 20:|Leviticus |Deuteronomy 5:|Deuteronomy 6:|Deuteronomy 22:)/.test(ref)) score += 10;
  if (/(wisdom|wise|fool|anger|money|tongue|speech|friend|counsel)/.test(q) && /^(Psalms |Proverbs |Ecclesiastes )/.test(ref)) score += 10;
  if (/(messiah|christ|cross|suffering|resurrection|virgin|king|david|seed)/.test(q) && /^(Genesis 3:15|Genesis 12:|2 Samuel 7:|Psalm 2:|Psalms 2:|Psalms 16:|Psalms 22:|Psalms 110:|Isaiah 7:|Isaiah 9:|Isaiah 53:|Micah 5:)/.test(ref)) score += 12;
  if (/(idolatry|idol|false god|worship)/.test(q) && /^(Exodus 20:|Deuteronomy 6:|Isaiah 44:|Jeremiah 10:)/.test(ref)) score += 12;

  return score;
}

function scorePassage(p, question, terms, originalWords) {
  const text = normalize(`${p.ref} ${p.text}`);
  let score = phraseScore(question, text, p.ref);

  for (const word of originalWords) {
    if (text.includes(word)) score += 8;
    if (p.book.toLowerCase().includes(word)) score += 4;
  }
  for (const term of terms) {
    if (text.includes(term)) score += 3;
  }

  // Boost high-signal doctrinal passages when matching related questions.
  const ref = p.ref;
  const q = normalize(question);
  if (/(works salvation|saved by works|earn salvation|works|grace|saved|salvation|gospel|faith|baptism)/.test(q) && /^(Romans 3:|Romans 4:|Romans 5:|Romans 10:|1 Corinthians 15:|Galatians 1:|Galatians 2:|Galatians 3:|Ephesians 2:|Titus 3:|Acts 4:|John 3:)/.test(ref)) score += 12;
  if (/(works salvation|saved by works|earn salvation|not of works)/.test(q) && /^(Ephesians 2:8|Ephesians 2:9|Titus 3:5|Romans 4:5|Galatians 2:16|Galatians 1:8|Galatians 1:9)/.test(ref)) score += 30;
  if (/(separate|separation|fellowship|unbeliever|false|doctrine|church|works salvation)/.test(q) && /^(2 Corinthians 6:|2 John 1:|Romans 16:|1 Corinthians 5:|2 Thessalonians 3:|1 Timothy 6:|Titus 3:|Ephesians 5:)/.test(ref)) score += 12;
  if (/(marry|marriage|dating|fornication|adultery|sexual|body|homosexual|gender)/.test(q) && /^(Matthew 19:|Mark 10:|Romans 1:|1 Corinthians 6:|1 Corinthians 7:|Ephesians 5:|Hebrews 13:)/.test(ref)) score += 12;
  if (/(communion|supper|bread|cup|remembrance|blood|body)/.test(q) && /^(Matthew 26:|Mark 14:|Luke 22:|1 Corinthians 10:|1 Corinthians 11:)/.test(ref)) score += 12;
  if (/(song|sing|music|psalm|hymn)/.test(q) && /^(Ephesians 5:|Colossians 3:|James 5:|1 Corinthians 14:)/.test(ref)) score += 12;

  // Prophetic event-marker boost: connect Revelation 6 sixth seal with parallel sun/moon/stars/earthquake/day-of-the-Lord passages.
  if (/(sixth seal|seal|sun|moon|stars|earthquake|heaven.*depart|wrath|day of the lord|darkened|blood)/.test(q) && /^(Revelation 6:12|Revelation 6:13|Revelation 6:14|Revelation 6:15|Revelation 6:16|Revelation 6:17|Matthew 24:29|Mark 13:24|Mark 13:25|Luke 21:25|Luke 21:26|Acts 2:19|Acts 2:20|Joel 2:10|Joel 2:30|Joel 2:31|Joel 3:15|Isaiah 13:10|Isaiah 13:13|Isaiah 34:4|Ezekiel 32:7|Ezekiel 32:8|Haggai 2:6|Haggai 2:21|Hebrews 12:26|Hebrews 12:27)/.test(ref)) score += 35;


  if (/(creation|created|beginning|male|female|marriage|one flesh|gender)/.test(q) && /^(Genesis 1:|Genesis 2:|Malachi 2:)/.test(ref)) score += 12;
  if (/(law|commandment|statute|judgment|ordinance|sabbath|clean|unclean)/.test(q) && /^(Exodus 20:|Leviticus |Deuteronomy 5:|Deuteronomy 6:|Deuteronomy 22:)/.test(ref)) score += 10;
  if (/(wisdom|wise|fool|anger|money|tongue|speech|friend|counsel)/.test(q) && /^(Psalms |Proverbs |Ecclesiastes )/.test(ref)) score += 10;
  if (/(messiah|christ|cross|suffering|resurrection|virgin|king|david|seed)/.test(q) && /^(Genesis 3:15|Genesis 12:|2 Samuel 7:|Psalm 2:|Psalms 2:|Psalms 16:|Psalms 22:|Psalms 110:|Isaiah 7:|Isaiah 9:|Isaiah 53:|Micah 5:)/.test(ref)) score += 12;
  if (/(idolatry|idol|false god|worship)/.test(q) && /^(Exodus 20:|Deuteronomy 6:|Isaiah 44:|Jeremiah 10:)/.test(ref)) score += 12;

  return score;
}

function searchBible(question, limit = 25) {
  const ref = parseReference(question);
  let exactMatches = [];
  const qForRef = normalize(question);
  const wantsCrossReferences = /(connect|connection|compare|parallel|cross reference|cross-reference|same event|sun|moon|stars|earthquake|heaven|wrath|day of the lord|darkened|blood|little horn|beast|42 months|forty two months|1260 days|time times|half a time|war with the saints|ten horns|blasphemy|great words)/.test(qForRef);
  if (ref) {
    exactMatches = exactReferenceResults(ref, limit);
    if (wantsCrossReferences && !ref.verseStart) exactMatches = [];
    // For simple reference lookups, return the requested passage. For prophetic/thematic connection questions,
    // keep the exact passage but continue searching so parallel passages can be included too.
    if (exactMatches.length && !wantsCrossReferences) return exactMatches;
  }

  const originalWords = tokenize(question);
  const terms = expandTerms(originalWords);
  const scored = biblePassages.map(p => ({ ...p, score: scorePassage(p, question, terms, originalWords) }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score || a.book.localeCompare(b.book) || a.chapter - b.chapter || a.verse - b.verse);

  const top = scored.slice(0, Math.max(limit, 12));
  const withContext = addNearbyContext(top.slice(0, Math.ceil(limit / 2)), 1);
  const connectionPassages = getConnectionPassages(question, [...exactMatches, ...top], biblePassages, limit);
  const combined = dedupe([...exactMatches, ...connectionPassages, ...top, ...withContext]);

  const fallbackRefs = new Set([
    'Genesis 1:1','Psalms 119:105','Psalms 119:160','Proverbs 3:5','Proverbs 3:6','Isaiah 8:20','2 Timothy 3:16','2 Timothy 3:17','Hebrews 4:12','John 3:16','John 3:17','John 3:18','Acts 4:12','1 Corinthians 15:3','1 Corinthians 15:4','Ephesians 2:8','Ephesians 2:9','Ephesians 2:10','2 Corinthians 6:14','2 Corinthians 6:15','2 Corinthians 6:16','2 Corinthians 6:17','Romans 16:17','Colossians 4:6'
  ]);
  const fallback = biblePassages.filter(p => fallbackRefs.has(p.ref));
  return (combined.length ? combined : fallback).slice(0, limit).map(({ score, ...p }) => p);
}

module.exports = { passages: biblePassages, searchBible, tokenize, expandTerms, parseReference };
