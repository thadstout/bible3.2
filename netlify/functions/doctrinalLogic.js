const DOCTRINAL_LOGIC = {
  romans: {
    triggers: [
      'romans','justification','justify','faith','works','law','grace','sin','flesh','spirit','israel','gentile','election','predestination','all men','whosoever','saved by works','lose salvation','book of life'
    ],
    rules: `
ROMANS DOCTRINAL LOGIC
1. Romans must be read as a sustained argument: universal guilt (1-3), justification by faith (3-5), union with Christ and freedom from sin (6), law exposing sin not saving (7), no condemnation and Spirit life (8), Israel/Gentile questions (9-11), and practical obedience flowing from mercy (12-16).
2. Do not make works the cause of justification. Romans contrasts faith and works in justification. Good works follow mercy; they do not purchase righteousness.
3. When Romans speaks of "law," examine whether the passage is referring to Mosaic law, moral commandment, law-principle, or the condemning function of law. Law reveals sin; it does not give saving life.
4. Handle "all" language by immediate context. Do not automatically make every "all" mean every person without exception or a limited group without context. Ask: all who? all in what sense? all under what headship?
5. Romans 9-11 must keep Israel, Gentiles, mercy, unbelief, stumbling, and future restoration distinct. Do not flatten Israel into the church when the passage is discussing Israel as Israel.
6. Romans 8 assurance passages should be allowed to speak strongly: no condemnation in Christ, Spirit witness, hope, intercession, and inseparability from the love of God.
7. Do not force a Calvinist or Arminian system onto Romans. Let the supplied text govern the conclusion.
8. Use Romans to test gospel questions: if the issue adds human merit as the ground of salvation, it conflicts with justification by faith.
`
  },
  ephesians: {
    triggers: [
      'ephesians','chosen','predestinated','predestination','in christ','grace through faith','faith and works','sealed','holy spirit','earnest','church','body of christ','walk worthy','darkness','light','marriage','husband','wife','armor of god'
    ],
    rules: `
EPHESIANS DOCTRINAL LOGIC
1. Ephesians should be read in two broad movements: doctrine of salvation and the church in Christ (1-3), then the believer's walk flowing from that calling (4-6).
2. When handling "chosen" or "predestinated," ask the textual question: chosen in whom, and chosen to what stated end? Do not import a system before reading the sentence.
3. Ephesians 1 emphasizes blessing "in Christ," adoption, redemption through His blood, forgiveness, the mystery of God's will, sealing with the Holy Spirit, and inheritance.
4. Ephesians 2:8-10 must keep the order clear: saved by grace through faith, not of works, created in Christ Jesus unto good works. Works are the fruit/purpose of salvation, not its purchase price.
5. The sealing and earnest language in Ephesians should strengthen assurance when those passages are present in the search results.
6. The "one body" logic of Ephesians should guide church unity questions, while Ephesians 5 should guide separation from darkness and unfruitful works.
7. Walk commands in Ephesians are addressed to believers and should not be turned into conditions for earning salvation.
8. Marriage passages in Ephesians 5 must be treated as direct apostolic instruction and tied to Christ and the church when relevant.
`
  },
  revelation: {
    triggers: [
      'revelation','prophecy','tribulation','antichrist','beast','mark of the beast','millennium','thousand years','book of life','lake of fire','new heaven','new earth','babylon','seven churches','last days','second coming','satan bound','resurrection','judgment seat','great white throne'
    ],
    rules: `
REVELATION DOCTRINAL LOGIC
1. Revelation should be handled with reverence and restraint. Do not speculate beyond the supplied Scripture.
2. Read Revelation literally unless the text marks symbolism or explains the symbol. When symbols appear, prefer the explanation given in the text and related Scripture.
3. Do not flatten Revelation into general church history or merely private spiritual experience. Keep judgment, kingdom, nations, Israel-related prophetic themes, resurrection, and final state distinct when the text does.
4. The seven churches are real churches with real exhortations; applications may be made carefully, but do not treat every detail as hidden allegory unless the text supports it.
5. The millennium/thousand years should not be dismissed or spiritualized without textual warrant. Let the repeated wording carry weight.
6. Book of life passages must be handled carefully. Say only what the searched passages establish, and avoid overstating beyond the text.
7. Revelation should be interpreted alongside Daniel, Matthew 24, and the prophets when those passages are included in the search results. If they are not present, do not pretend they were searched unless listed.
8. Distinguish present church instruction, future tribulation/judgment, kingdom reign, final judgment, and new heaven/new earth.
`
  },
  greek: {
    triggers: [
      'greek','word means','original language','chosen','predestinated','sealed','earnest','redemption','mystery','repent','believe','faith','grace','church','ecclesia','agape','logos'
    ],
    rules: `
CONTROLLED GREEK/TR NOTES
1. Greek notes are subordinate helps, not a second authority above Scripture. The answer must rest on the supplied KJV passages.
2. Do not invent Greek grammar, parsing, or lexical claims. Use only the approved notes below when directly relevant.
3. For Ephesians 1, observe repeated "in Christ / in whom" logic. The grammar of the passage should cause the app to ask: chosen in whom, and chosen to what end stated in the text.
4. For Ephesians 2:8-10, do not isolate one English phrase in a way that overturns the whole sentence. The whole salvation-by-grace-through-faith reality is God's gift and is not of works; believers are created unto good works.
5. For "sealed" in Ephesians, treat sealing as God's mark/security/ownership language when the supplied passage supports it.
6. For "earnest" in Ephesians 1, treat it as pledge/down-payment/inheritance assurance language when the supplied passage supports it.
7. For "mystery" in Ephesians, treat it as truth now revealed in Christ, especially the Gentiles included in one body when the supplied passage supports it.
8. For Revelation, do not use Greek to erase plain repeated English statements such as "thousand years." Greek may clarify, but not nullify, the textual claim.
`
  }
};

function getDoctrinalLogic(question, passages) {
  const q = String(question || '').toLowerCase();
  const refs = (passages || []).map(p => String(p.ref || '').toLowerCase()).join(' ');
  const haystack = `${q} ${refs}`;
  const selected = [];
  for (const [key, item] of Object.entries(DOCTRINAL_LOGIC)) {
    if (item.triggers.some(t => haystack.includes(t))) {
      selected.push(item.rules.trim());
    }
  }
  if (!selected.length) return 'No special Romans/Ephesians/Revelation doctrinal logic was triggered. Use the general interpretive rules only.';
  return selected.join('\n\n');
}

module.exports = { DOCTRINAL_LOGIC, getDoctrinalLogic };
