const PROPHETIC_CONNECTIONS = [
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

function triggeredConnections(question, passages = []) {
  const q = normalize(question);
  const passageHaystack = passages.map(p => `${p.ref || ''} ${p.text || ''}`).join(' ');
  const haystack = normalize(`${q} ${passageHaystack}`);
  return PROPHETIC_CONNECTIONS.filter(conn => conn.triggers.some(t => haystack.includes(normalize(t))));
}

function getConnectionPassages(question, currentPassages, allPassages, limit = 25) {
  const connections = triggeredConnections(question, currentPassages);
  if (!connections.length) return [];
  const refs = new Set(connections.flatMap(c => c.refs));
  return allPassages.filter(p => refs.has(p.ref)).slice(0, limit);
}

function getConnectionInstructions(question, passages = []) {
  const connections = triggeredConnections(question, passages);
  if (!connections.length) return 'No special prophetic connection helper was triggered.';
  return connections.map(c => {
    return `PROPHETIC CONNECTION HELPER: ${c.title}\nMarkers to compare: ${c.markers.join('; ')}.\nInstruction: ${c.instruction}`;
  }).join('\n\n');
}

module.exports = { PROPHETIC_CONNECTIONS, triggeredConnections, getConnectionPassages, getConnectionInstructions };
