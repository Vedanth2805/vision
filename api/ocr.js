import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash'
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });

    const imageParts = [{
      inlineData: {
        data: image,
        mimeType: 'image/png'
      }
    }];

    const prompt = "Extract all text from this image exactly as it appears. Preserve line breaks, spacing, and original formatting. Do not add any additional text or interpretation.";
    const result = await geminiModel.generateContent([prompt, ...imageParts]);
    const text = (await result.response.text())
      .replace(/```/g, '')
      .trim();

    return res.json({ text });

  } catch (error) {
    console.error('OCR Error:', error);
    return res.status(500).json({ error: 'Failed to process image' });
  }
}