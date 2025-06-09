export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, modelType } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    const modelMap = {
      'fast': 'deepseek/deepseek-r1-distill-qwen-32b:free',
      'accurate': 'deepseek/deepseek-r1:free'
    };

    const selectedModel = modelMap[modelType];
    if (!selectedModel) return res.status(400).json({ error: 'Invalid model type' });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'VisionText'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: "system",
            content: `You are an expert at summarizing complex information in multiple languages. Always detect the user's input language automatically and respond in the exact same language without switching to another language. Provide clear, concise, and well-structured summaries using markdown formatting. Preserve all key technical details and important nuances. Limit the entire summary within 5000 tokens. Do not add unnecessary explanations or translations.`
          },
          {
            role: "user",
            content: `Please create a comprehensive summary of the following text. Use the same language as the input text, preserving all technical details. The summary should be clear, concise, and formatted with markdown. Limit the response to 5000 tokens.\n\n${text}`
          }
        ],
        max_tokens: 5000,
        temperature: 0.2
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenRouter Error:', data);
      return res.status(500).json({ 
        error: 'Failed to generate summary',
        details: data.error?.message || 'Unknown API error'
      });
    }

    if (data.choices?.length > 0) {
      return res.json({ summary: data.choices[0].message.content });
    } else {
      return res.status(500).json({ error: 'No summary generated' });
    }

  } catch (error) {
    console.error('Summary Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}