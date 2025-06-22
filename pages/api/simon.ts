import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const promptPath = path.resolve(process.cwd(), 'instructions', 'simon-prompt.txt');
const memoryFile = path.resolve(process.cwd(), 'logs', 'simon-memory.json'); // Still declared but not used

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, messages } = req.body;

  if (!userId || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  let simonSystemPrompt = '';
  let userMemory = '';

  try {
    simonSystemPrompt = fs.readFileSync(promptPath, 'utf8');
  } catch (err) {
    console.error('🛑 Failed to read simon-prompt.txt:', err);
    return res.status(500).json({ error: "Failed to load Simon's system prompt." });
  }

  try {
    if (fs.existsSync(memoryFile)) {
      const memoryData = JSON.parse(fs.readFileSync(memoryFile, 'utf-8'));
      userMemory = memoryData[userId] || '';
    }
  } catch (err) {
    console.warn('⚠️ Failed to read user memory:', err);
    userMemory = ''; // fallback
  }

  const fullPrompt = `
${simonSystemPrompt}

Known memory from this user:
${userMemory}
  `.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: fullPrompt },
        ...messages,
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const reply = completion.choices?.[0]?.message?.content;

    if (!reply) {
      console.error('⚠️ No reply from OpenAI:', completion);
      return res.status(500).json({ error: 'Simon could not generate a response.' });
    }

    // Memory writing is disabled in Vercel deployment
    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('🔥 Simon API Error:', error?.response?.data || error.message || error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
