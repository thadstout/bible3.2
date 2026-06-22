const passages = [
  { ref: '2 Timothy 3:16-17', text: 'All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness: That the man of God may be perfect, throughly furnished unto all good works.', tags: ['scripture', 'sufficiency', 'doctrine', 'correction'] },
  { ref: 'Psalm 12:6', text: 'The words of the LORD are pure words: as silver tried in a furnace of earth, purified seven times.', tags: ['scripture', 'words', 'pure'] },
  { ref: 'Hebrews 4:12', text: 'For the word of God is quick, and powerful, and sharper than any twoedged sword...', tags: ['scripture', 'word', 'discernment'] },
  { ref: 'Galatians 1:8-9', text: 'But though we, or an angel from heaven, preach any other gospel unto you... let him be accursed.', tags: ['gospel', 'false gospel', 'works salvation'] },
  { ref: 'Ephesians 2:8-10', text: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works...', tags: ['gospel', 'salvation', 'grace', 'faith', 'works'] },
  { ref: 'Titus 3:5', text: 'Not by works of righteousness which we have done, but according to his mercy he saved us...', tags: ['gospel', 'salvation', 'works'] },
  { ref: 'Romans 4:5', text: 'But to him that worketh not, but believeth on him that justifieth the ungodly...', tags: ['gospel', 'faith', 'works', 'justification'] },
  { ref: '2 Corinthians 6:14-17', text: 'Be ye not unequally yoked together with unbelievers... wherefore come out from among them, and be ye separate...', tags: ['separation', 'unbeliever', 'fellowship'] },
  { ref: '2 John 1:9-11', text: 'Whosoever transgresseth, and abideth not in the doctrine of Christ, hath not God... neither bid him God speed...', tags: ['separation', 'doctrine', 'christ', 'false teacher'] },
  { ref: 'Romans 16:17', text: 'Mark them which cause divisions and offences contrary to the doctrine which ye have learned; and avoid them.', tags: ['separation', 'doctrine', 'avoid'] },
  { ref: '2 Thessalonians 3:6', text: 'Withdraw yourselves from every brother that walketh disorderly, and not after the tradition which he received of us.', tags: ['separation', 'disorderly', 'withdraw'] },
  { ref: '1 Corinthians 5:11', text: 'But now I have written unto you not to keep company, if any man that is called a brother be a fornicator...', tags: ['separation', 'sin', 'company'] },
  { ref: 'Amos 3:3', text: 'Can two walk together, except they be agreed?', tags: ['agreement', 'fellowship', 'separation'] },
  { ref: 'Ephesians 4:15', text: 'But speaking the truth in love, may grow up into him in all things, which is the head, even Christ:', tags: ['tone', 'truth', 'love'] },
  { ref: 'Colossians 4:6', text: 'Let your speech be alway with grace, seasoned with salt...', tags: ['tone', 'speech', 'grace'] },
  { ref: 'Matthew 10:16', text: 'Behold, I send you forth as sheep in the midst of wolves: be ye therefore wise as serpents, and harmless as doves.', tags: ['wisdom', 'tone', 'discernment'] },
  { ref: '1 Thessalonians 5:21-22', text: 'Prove all things; hold fast that which is good. Abstain from all appearance of evil.', tags: ['discernment', 'prove', 'abstain'] },
  { ref: '1 Corinthians 10:31', text: 'Whether therefore ye eat, or drink, or whatsoever ye do, do all to the glory of God.', tags: ['wisdom', 'glory', 'conduct'] },
  { ref: '1 Corinthians 8:9', text: 'But take heed lest by any means this liberty of yours become a stumblingblock to them that are weak.', tags: ['liberty', 'stumblingblock', 'wisdom'] },
  { ref: 'Romans 14:23', text: '...for whatsoever is not of faith is sin.', tags: ['conscience', 'faith', 'wisdom'] },
  { ref: 'Genesis 2:24', text: 'Therefore shall a man leave his father and his mother, and shall cleave unto his wife...', tags: ['marriage', 'gender', 'family'] },
  { ref: 'Mark 10:6-9', text: 'But from the beginning of the creation God made them male and female...', tags: ['marriage', 'gender', 'creation'] },
  { ref: '1 Corinthians 6:18-20', text: 'Flee fornication... ye are bought with a price: therefore glorify God in your body...', tags: ['body', 'purity', 'sexual sin'] },
  { ref: 'Romans 1:24-27', text: '...God gave them up unto vile affections...', tags: ['sexual sin', 'homosexuality', 'creation'] },
  { ref: '1 Corinthians 6:9-11', text: '...such were some of you: but ye are washed, but ye are sanctified...', tags: ['sin', 'hope', 'washed', 'sexual sin'] },
  { ref: 'John 14:6', text: 'Jesus saith unto him, I am the way, the truth, and the life...', tags: ['christ', 'salvation', 'truth'] },
  { ref: 'Acts 4:12', text: 'Neither is there salvation in any other: for there is none other name under heaven given among men...', tags: ['christ', 'salvation', 'gospel'] },
  { ref: '1 Corinthians 15:3-4', text: '...Christ died for our sins according to the scriptures; And that he was buried, and that he rose again...', tags: ['gospel', 'resurrection', 'christ'] },
  { ref: 'John 3:16-18', text: 'For God so loved the world, that he gave his only begotten Son...', tags: ['gospel', 'believe', 'salvation'] },
  { ref: 'James 1:5', text: 'If any of you lack wisdom, let him ask of God...', tags: ['wisdom', 'prayer'] }
];

const stopWords = new Set(['the','a','an','and','or','but','is','are','was','were','to','of','in','on','for','with','my','me','i','it','that','this','can','should','do','does','be','as','at','from','if','what','about','have','has']);

function tokenize(input) {
  return String(input || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w && !stopWords.has(w));
}

function searchBible(question, limit = 10) {
  const words = tokenize(question);
  const scored = passages.map(p => {
    const haystack = `${p.ref} ${p.text} ${p.tags.join(' ')}`.toLowerCase();
    let score = 0;
    for (const word of words) {
      if (haystack.includes(word)) score += 2;
      for (const tag of p.tags) if (tag.includes(word) || word.includes(tag)) score += 3;
    }
    return { ...p, score };
  }).filter(p => p.score > 0).sort((a, b) => b.score - a.score);

  const fallback = passages.filter(p => ['scripture','gospel','separation','wisdom','tone'].some(t => p.tags.includes(t))).slice(0, limit);
  return (scored.length ? scored : fallback).slice(0, limit).map(({ score, ...p }) => p);
}

module.exports = { passages, searchBible };
