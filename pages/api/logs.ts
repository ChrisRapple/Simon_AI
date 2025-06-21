import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const logPath = path.resolve('./logs/simon-log.json');

  try {
    const logData = fs.readFileSync(logPath, 'utf-8');
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(logData);
  } catch (error) {
    console.error('Error reading log file:', error);
    res.status(500).json({ error: 'Failed to read log file' });
  }
}
