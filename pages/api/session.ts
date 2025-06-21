// File: /pages/api/session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.cookie || '');
  const sessionUser = cookies.session;

  if (!sessionUser) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  return res.status(200).json({ user: sessionUser });
}
