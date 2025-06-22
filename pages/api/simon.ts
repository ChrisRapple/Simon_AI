// FULL PATH: pages/api/simon.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const promptPath = path.resolve(process.cwd(), 'instructions', 'simon-prompt.txt');
const memoryFile = path.resolve(process.cwd(), 'logs', 'simon-memory.json');

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
    return res.status(500).json({ error: 'Failed to load Simon\'s system prompt.' });
  }

  try {
    if (fs.existsSync(memoryFile)) {
      const memoryData = JSON.parse(fs.readFileSync(memoryFile, 'utf-8'));
      userMemory = memoryData[userId] || '';
    }
  } catch (err) {
    console.warn('⚠️ Fa
