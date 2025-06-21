// FULL PATH: pages/api/simon.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const promptPath = path.resolve(process.cwd(), 'instructions', 'simon-prompt.txt');
const memoryFile = path.resolve('./logs/simon-memory.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, messages } = req.body;

  if (!userId || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  // Load Simon's base prompt
  const simonSystemPrompt = fs.readFileSync(promptPath, 'utf8');

  // Load user memory
  let userMemory = '';
  if (fs.existsSync(memoryFile)) {
    const memoryData = JSON.parse(fs.readFileSync(memoryFile, 'utf-8'));
    userMemory = memoryData[userId] || '';
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
        {
          role: 'system',
          content: fullPrompt,
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

    // Save the short-term memory
    const memoryData = fs.existsSync(memoryFile)
      ? JSON.parse(fs.readFileSync(memoryFile, 'utf-8'))
      : {};
    memoryData[userId] = reply.slice(0, 400);
    fs.writeFileSync(memoryFile, JSON.stringify(memoryData, null, 2));

    res.status(200).json({ reply });
  } catch (error: any) {
    console.error('🔥 Simon API Error:', error?.response?.data || error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
