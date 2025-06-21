// File: /pages/register.tsx
import { useState } from 'react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Registering...');

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus('✅ Registration successful! You can now log in.');
    } else {
      setStatus(`❌ ${data.error || 'Something went wrong.'}`);
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: '0 auto', color: '#fff', backgroundColor: '#111', fontFamily: 'sans-serif' }}>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <button type="submit" style={{ padding: 10, width: '100%', background: '#444', color: '#fff', border: 'none' }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: 20 }}>{status}</p>
    </div>
  );
}
