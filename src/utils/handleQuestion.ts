export const promptOpenAI = async (question: string) => {
  const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
  };

  const body = JSON.stringify({
    messages: [
      {
        role: 'system',
        content:
          'You will be provided with a string of text, and your task is to provide an answer with no more than 100 characters.',
      },
      {
        role: 'user',
        content: question,
      },
    ],
    model: 'gpt-3.5-turbo',
    max_tokens: 1024,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  fetch(openaiEndpoint, {
    method: 'POST',
    headers,
    body,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.choices[0].message.content);
    })
    .catch((error) => console.log(error));
};
