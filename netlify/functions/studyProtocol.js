function includesAny(q, words) {
  return words.some(w => q.includes(w));
}

const GENERAL_STUDY_PROTOCOL = `
TRUE INTERPRETATION DISCIPLINE - BIBLE-ONLY STUDY PROTOCOL

Purpose:
This protocol must not supply theological conclusions. It only controls method. It is a restraint against bias, system-reading, isolated proof-texting, and overstatement.

General study order:
1. Identify the exact question being asked.
2. Identify the kind of question: doctrine, command, wisdom, narrative, prophecy, poetry, law, gospel, church practice, personal application, or unclear.
3. Gather direct passages first, then related passages, then broader principles.
4. Check immediate context before drawing a conclusion from a verse.
5. Identify who is speaking, who is addressed, and what issue the passage is answering.
6. Compare Scripture with Scripture before concluding.
7. Do not let a repeated word alone prove a doctrine. Words must be read in their sentence, paragraph, book, and whole-Bible context.
8. Do not use a theological system name, denominational label, commentary tradition, or internet knowledge to settle the answer.
9. Do not use the absence of a verse as proof that something is right or wrong.
10. If the available verses do not fully answer the question, say exactly what they do establish and what they do not establish.
11. If passages appear to be in tension, do not cancel one passage with another. State both truths and limit the conclusion to what the combined passages actually establish.
12. The final answer must be smaller than the evidence, not larger than the evidence.

Vocabulary discipline:
13. Before concluding from a doctrinal word, ask: What does this word mean in this immediate context?
14. Ask: Is the same word being used the same way in each passage, or are the contexts different?
15. Ask: What is the object of the word? For example, chosen to what, called to what, saved from what, saved unto what, judged for what?
16. Do not treat similar words as identical doctrines unless the passages themselves connect the ideas.
17. Do not treat different words as unrelated when the passages share the same subject, action, or event markers.

Evidence categories:
18. Direct statement: a passage directly answers the question.
19. Necessary implication: the conclusion follows from what the passage states.
20. Repeated textual marker: multiple passages share rare descriptions or event markers.
21. Principle: the passage gives a general truth that may guide an application.
22. Insufficient evidence: the supplied passages do not establish a firm conclusion.

Show Your Work requirements:
23. Show the path: direct texts -> related texts -> comparison -> conclusion.
24. Name the evidence category used: direct statement, necessary implication, repeated marker, principle, or insufficient evidence.
25. State when a conclusion is limited.
`;

const SALVATION_STUDY_PROTOCOL = `
SALVATION / ELECTION / PREDESTINATION STUDY PROTOCOL

This is not a doctrinal conclusion file. It is a study checklist to prevent distorted answers from isolated salvation vocabulary.

When the question concerns salvation, heaven, hell, election, predestination, calling, foreknowledge, grace, faith, works, justification, eternal life, condemnation, or the will of God:

1. Do not answer from one vocabulary family only. Gather passages about:
   - God's saving desire and gospel provision
   - man's responsibility to believe or reject
   - grace, faith, and works
   - election, foreknowledge, predestination, calling
   - condemnation and judgment
   - security, sealing, eternal life, and assurance
   - gospel invitation and preaching
2. Do not assume chosen means chosen to heaven or chosen to hell. Ask: chosen to what, in whom, for what purpose, and according to what context?
3. Do not assume predestinated means every detail of eternal destiny unless the passage itself says so. Ask: predestinated to what?
4. Do not assume all, world, many, us, we, they, Israel, Gentiles, church, or elect always has the same scope. Determine scope from context.
5. Do not turn passages about believers' blessings in Christ into a statement that God selected others for damnation unless the passage says that.
6. Do not turn passages about man's responsibility into denial of God's foreknowledge, calling, grace, or purpose.
7. Do not make Romans 9, Ephesians 1, John 3, Romans 10, or any single passage cancel the others.
8. If asked whether God chooses who goes to heaven and hell, compare at minimum the supplied passages on God's desire, man's believing/rejecting, grace through faith, election/predestination language, and condemnation.
9. State only what the collected passages establish. If the collected passages do not state a symmetrical choice of some to heaven and some to hell, do not state it.
10. If the verses show condemnation connected to unbelief, rejection, sin, or judgment according to works, say that from the verses.
11. If the verses show salvation is by grace through faith and not works, say that from the verses.
12. Avoid theological-system labels. Use Bible language.
`;

const ATONEMENT_SCOPE_STUDY_PROTOCOL = `
Atonement Scope Study Protocol:
1. If the question asks whether Jesus/Christ died for everyone, gather direct atonement-scope texts before application texts.
2. Prioritize explicit supplied phrases: tasted death for every man; gave himself a ransom for all; died for all; Saviour of all men, specially of those that believe; propitiation for the whole world.
3. Distinguish what the passage says about the scope of Christ's death from what other passages say about who receives salvation by faith.
4. Do not use election/application language to cancel or soften direct all/every/world passages unless a supplied verse directly limits the death of Christ.
5. Do not use theological shorthand such as limited atonement, sufficient/effective, or particular redemption as the answer. Explain only what the supplied verses say.
`;

const PROPHECY_STUDY_PROTOCOL = `
PROPHECY STUDY PROTOCOL

When the question concerns prophecy, Daniel, Revelation, beast, antichrist, little horn, seals, trumpets, day of the Lord, second coming, kingdom, millennium, tribulation, or related events:

1. Do not build a conclusion from one symbol alone.
2. Gather passages with shared event markers, titles, actions, time periods, and outcomes.
3. Distinguish direct statement from repeated textual marker.
4. When passages share rare markers, explain the connection as a textual comparison, not as a commentary claim.
5. Do not flatten prophecy into history unless the supplied Scripture clearly establishes fulfillment.
6. Do not speculate beyond what the supplied passages say.
`;

function getStudyProtocol(question) {
  const q = String(question || '').toLowerCase();
  let protocol = GENERAL_STUDY_PROTOCOL;

  if (includesAny(q, [
    'salvation','saved','save','heaven','hell','eternal life','everlasting life','condemn','condemnation','damnation',
    'elect','election','chosen','choose','chooses','predestinate','predestinated','predestination','foreknow','foreknowledge','called','calling',
    'grace','faith','believe','whosoever','gospel','justified','justification','works','born again','book of life','died for all','died for everyone','die for everyone','ransom for all','tasted death for every man','atonement','propitiation','saviour of all men','savior of all men'
  ])) {
    protocol += '\n' + SALVATION_STUDY_PROTOCOL;
  }

  if (includesAny(q, [
    'did jesus die for everyone','did christ die for everyone','died for everyone','die for everyone','died for all','die for all',
    'tasted death for every man','taste death for every man','ransom for all','saviour of all men','savior of all men',
    'propitiation for the whole world','limited atonement','particular redemption','atonement'
  ])) {
    protocol += '\n' + ATONEMENT_SCOPE_STUDY_PROTOCOL;
  }

  if (includesAny(q, [
    'prophecy','revelation','daniel','beast','antichrist','little horn','seal','trumpet','vial','bowl','day of the lord',
    'second coming','tribulation','millennium','kingdom','mark of the beast','1260','42 months','time times'
  ])) {
    protocol += '\n' + PROPHECY_STUDY_PROTOCOL;
  }

  return protocol;
}

module.exports = { getStudyProtocol };
