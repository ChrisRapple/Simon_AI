import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load Simon's system prompt from external file
const promptPath = path.resolve(process.cwd(), 'instructions', 'simon-prompt.txt');
const simonSystemPrompt = fs.readFileSync(promptPath, 'utf8');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: simonSystemPrompt,
        },
        ...messages,
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const reply = completion.choices?.[0]?.message?.content;

    if (!reply) {
      console.error('⚠️ OpenAI returned no reply:', completion);
      return res.status(500).json({ error: 'Simon could not generate a response.' });
    }

    res.status(200).json({ reply });

  } catch (error: any) {
    console.error('🔥 Simon API Error:', error?.response?.data || error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
