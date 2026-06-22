const PROPHETIC_CONNECTIONS = [

  {
    id: 'antichrist_end_times_ruler_actions',
    title: 'Antichrist / beast / little horn / man of sin action map',
    triggers: [
      'antichrist','what does the antichrist do','end times ruler','man of sin','son of perdition','wicked one','beast','mark of the beast','image of the beast','little horn','prince that shall come','abomination of desolation','false prophet','buy or sell','right hand','forehead','war with the saints','overcome the saints','wear out the saints','beheaded'
    ],
    markers: [
      'denies the Father and the Son / spirit of antichrist language',
      'little horn / beast / man of sin / wicked one title cluster',
      'speaks great things and blasphemies',
      'opposes and exalts himself above God',
      'makes war with the saints and overcomes/wears them out for a limited time',
      'deceives with signs or lying wonders',
      'uses image/mark worship and buying-selling control',
      'is judged/destroyed by Christ'
    ],
    refs: [
      '1 John 2:18','1 John 2:22','1 John 4:3','2 John 1:7',
      'Revelation 13:5','Revelation 13:6','Revelation 13:7','Revelation 13:8','Revelation 13:15','Revelation 13:16','Revelation 13:17','Revelation 13:18','Revelation 20:4',
      'Daniel 7:8','Daniel 7:11','Daniel 7:21','Daniel 7:25','Daniel 7:26','Daniel 7:27',
      '2 Thessalonians 2:3','2 Thessalonians 2:4','2 Thessalonians 2:8','2 Thessalonians 2:9','2 Thessalonians 2:10',
      'Daniel 8:23','Daniel 8:24','Daniel 8:25','Daniel 9:26','Daniel 9:27','Daniel 11:36','Daniel 11:37','Daniel 11:38','Daniel 11:39','Daniel 11:40',
      'Daniel 12:7','Daniel 12:11','Daniel 12:12',
      'Matthew 24:15','Matthew 24:21','Matthew 24:22','Matthew 24:24',
      'Revelation 13:1','Revelation 13:2','Revelation 13:3','Revelation 13:4','Revelation 13:11','Revelation 13:12','Revelation 13:13','Revelation 13:14',
      'Revelation 14:9','Revelation 14:10','Revelation 14:11','Revelation 15:2','Revelation 16:2','Revelation 19:19','Revelation 19:20'
    ],
    instruction: `When a question asks what the antichrist does, do not stop with only the word antichrist in John's epistles. First cite John's direct antichrist passages if supplied, then compare the related end-times ruler passages by textual markers: little horn, beast, man of sin, son of perdition, wicked one, blasphemy, self-exaltation, war with saints, 42 months/time-times-half-a-time, image/mark, buying and selling, deception, and final judgment. Do not merely assert the titles are identical; state that the app is comparing passages because they share distinctive biblical identifiers.`
  },
  {
    id: 'little_horn_beast_42_months_war_with_saints',
    title: 'Daniel little horn / Revelation beast / 3.5-year war with saints',
    triggers: [
      'little horn','beast','revelation 13','daniel 7','42 months','forty two months','time times half','time and times','half a time','1260 days','thousand two hundred and threescore','war with the saints','wear out the saints','overcome the saints','ten horns','great words','blasphemy','blasphemies'
    ],
    markers: [
      'ten horns',
      'little horn / beast ruler imagery',
      'mouth speaking great things / great words',
      'blasphemy or words against God',
      'war with the saints / overcoming or wearing out the saints',
      'time, times, and half a time / 42 months / 1260 days'
    ],
    refs: [
      'Daniel 7:7','Daniel 7:8','Daniel 7:11','Daniel 7:20','Daniel 7:21','Daniel 7:23','Daniel 7:24','Daniel 7:25','Daniel 7:26','Daniel 7:27',
      'Daniel 12:7','Daniel 12:11','Daniel 12:12',
      'Revelation 11:2','Revelation 11:3',
      'Revelation 12:6','Revelation 12:14',
      'Revelation 13:1','Revelation 13:2','Revelation 13:5','Revelation 13:6','Revelation 13:7','Revelation 13:8',
      'Revelation 17:12','Revelation 17:13','Revelation 17:14'
    ],
    instruction: `When a question mentions Daniel's little horn, Revelation 13's beast, war with the saints, ten horns, blasphemous/great words, 42 months, 1260 days, or time-times-half-a-time, intentionally compare Daniel 7 with Revelation 13 and the time-period passages. State the connection as repeated textual markers, not as commentary. The app may say these passages share distinctive identifiers; it should cite the supplied verses and avoid speculation beyond them.`
  },
  {
    id: 'sixth_seal_cosmic_day_of_lord',
    title: 'Sixth seal cosmic disturbance / day of the Lord marker set',
    triggers: [
      'sixth seal','sun darkened','moon blood','moon darkened','stars fall','earthquake','heaven departed','day of the lord','day of wrath','wrath of the lamb'
    ],
    markers: [
      'sun darkened or blackened',
      'moon darkened or turned to blood',
      'stars falling or heavens shaken',
      'great earthquake or earth shaking',
      'day of the Lord / wrath language'
    ],
    refs: [
      'Revelation 6:12','Revelation 6:13','Revelation 6:14','Revelation 6:15','Revelation 6:16','Revelation 6:17',
      'Matthew 24:29','Mark 13:24','Mark 13:25','Luke 21:25','Luke 21:26','Acts 2:19','Acts 2:20','Joel 2:10','Joel 2:30','Joel 2:31','Joel 3:15','Isaiah 13:10','Isaiah 13:13','Isaiah 34:4','Ezekiel 32:7','Ezekiel 32:8','Haggai 2:6','Haggai 2:21','Hebrews 12:26','Hebrews 12:27'
    ],
    instruction: `When Revelation 6:12-17 or sixth seal language appears, intentionally compare the shared cosmic and wrath markers with Matthew 24, Mark 13, Luke 21, Joel, Isaiah, Ezekiel, Haggai, Acts, and Hebrews when those passages are supplied.`
  }
];

function normalize(str) {
  return String(str || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9:\-\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function isProphecyQuestion(question) {
  const q = normalize(question);
  const prophecyTerms = [
    'prophecy','revelation','daniel','antichrist','beast','little horn','man of sin','son of perdition','wicked one',
    'mark of the beast','image of the beast','abomination of desolation','false prophet','sixth seal','seal','trumpet',
    'vial','bowl','tribulation','day of the lord','wrath of the lamb','sun darkened','moon blood','stars fall',
    '42 months','forty two months','1260','time times','half a time','war with the saints','ten horns','millennium'
  ];
  return prophecyTerms.some(t => q.includes(normalize(t)));
}

function triggeredConnections(question, passages = []) {
  // Prophetic helpers must be triggered by the question itself, not by incidental
  // words in preliminary search results. This keeps prophecy from hijacking
  // salvation or definition questions.
  if (!isProphecyQuestion(question)) return [];
  const q = normalize(question);
  return PROPHETIC_CONNECTIONS.filter(conn => conn.triggers.some(t => q.includes(normalize(t))));
}

function getConnectionPassages(question, currentPassages, allPassages, limit = 25) {
  const connections = triggeredConnections(question, currentPassages);
  if (!connections.length) return [];
  const refOrder = connections.flatMap(c => c.refs);
  const byRef = new Map(allPassages.map(p => [p.ref, p]));
  const ordered = [];
  const seen = new Set();
  for (const ref of refOrder) {
    if (!seen.has(ref) && byRef.has(ref)) {
      ordered.push(byRef.get(ref));
      seen.add(ref);
    }
  }
  return ordered.slice(0, limit);
}

function getConnectionBoostRefs(question, passages = []) {
  const connections = triggeredConnections(question, passages);
  return new Set(connections.flatMap(c => c.refs));
}

function getConnectionInstructions(question, passages = []) {
  const connections = triggeredConnections(question, passages);
  if (!connections.length) return 'No special prophetic connection helper was triggered.';
  return connections.map(c => {
    return `PROPHETIC CONNECTION HELPER: ${c.title}\nMarkers to compare: ${c.markers.join('; ')}.\nInstruction: ${c.instruction}`;
  }).join('\n\n');
}

module.exports = { PROPHETIC_CONNECTIONS, isProphecyQuestion, triggeredConnections, getConnectionPassages, getConnectionBoostRefs, getConnectionInstructions };
