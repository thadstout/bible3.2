exports.handler = async function () {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      app: 'Bible Answers App',
      version: '3.1.0',
      openAiKeyPresent: Boolean(process.env.OPENAI_API_KEY)
    })
  };
};
