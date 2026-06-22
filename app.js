const healthText = document.getElementById('healthText');
const questionEl = document.getElementById('question');
const askButton = document.getElementById('askButton');
const clearButton = document.getElementById('clearButton');
const answerPanel = document.getElementById('answerPanel');
const answerText = document.getElementById('answerText');
const workText = document.getElementById('workText');
const outcomeBadge = document.getElementById('outcomeBadge');

async function checkHealth() {
  try {
    const res = await fetch('/.netlify/functions/health');
    const data = await res.json();
    healthText.textContent = data.ok ? 'Ready' : 'Problem';
  } catch (err) {
    healthText.textContent = 'Not connected';
  }
}

function setLoading(isLoading) {
  askButton.disabled = isLoading;
  askButton.textContent = isLoading ? 'Searching Scripture...' : 'Ask Bible App';
}

function formatText(text) {
  return String(text || '').trim();
}

async function askQuestion() {
  const question = questionEl.value.trim();
  if (!question) {
    answerPanel.classList.remove('hidden');
    outcomeBadge.textContent = 'Need question';
    answerText.textContent = 'Please type a Bible question first.';
    workText.textContent = '';
    return;
  }

  setLoading(true);
  answerPanel.classList.remove('hidden');
  outcomeBadge.textContent = 'Working';
  answerText.textContent = 'Searching the KJV Scripture index and preparing an answer...';
  workText.textContent = '';

  try {
    const res = await fetch('/.netlify/functions/answerQuestion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'The app could not answer that question.');
    outcomeBadge.textContent = data.outcome || 'Answer';
    answerText.textContent = formatText(data.answer);
    workText.textContent = formatText(data.showYourWork || 'No additional reasoning returned.');
  } catch (err) {
    outcomeBadge.textContent = 'Error';
    answerText.textContent = err.message || 'Something went wrong.';
    workText.textContent = 'Check Netlify Functions, the OPENAI_API_KEY environment variable, and deploy logs.';
  } finally {
    setLoading(false);
  }
}

askButton.addEventListener('click', askQuestion);
clearButton.addEventListener('click', () => {
  questionEl.value = '';
  answerPanel.classList.add('hidden');
});
questionEl.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') askQuestion();
});
checkHealth();
