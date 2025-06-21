import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const memoryPath = path.resolve('./logs/simon-memory.json');

  if (!fs.existsSync(memoryPath)) {
    return res.status(200).json({});
  }

  try {
    const data = JSON.parse(fs.readFileSync(memoryPath, 'utf-8'));
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Failed to read memory:', error);
    res.status(500).json({ error: 'Failed to read memory file.' });
  }
}
