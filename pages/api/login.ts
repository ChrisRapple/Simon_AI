import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

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
    return res.status(404).json({ error: 'No users found.' });
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

  const user = users[username];
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  // Set cookie (session)
  const cookie = serialize('session', username, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ message: 'Login successful.' });
}
