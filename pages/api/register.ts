// File: /pages/api/register.ts
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

  const hashedPassword = await bcrypt.hash(password, 10);

  let users: Record<string, any> = {};

  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

    if (users[username]) {
      return res.status(409).json({ error: 'Username already exists.' });
    }
  }

  users[username] = { password: hashedPassword, created: new Date().toISOString() };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  return res.status(201).json({ message: 'User registered successfully.' });
}
