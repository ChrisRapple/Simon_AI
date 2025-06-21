// File: /pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const USERS_FILE = path.resolve('./logs/users.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }

  if (!fs.existsSync(USERS_FILE)) {
    return res.status(404).json({ error: 'No users registered.' });
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

  const user = users[username];

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  return res.status(200).json({ message: 'Login successful.', userId: username });
}
