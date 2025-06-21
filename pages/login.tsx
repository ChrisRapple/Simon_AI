import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(`✅ Success: ${data.message}`);
    } else {
      setMessage(`❌ Error: ${data.error || 'Login failed'}`);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1>Login to Simon AI</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ padding: 10, borderRadius: 4 }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: 10, borderRadius: 4 }}
          required
        />
        <button type="submit" style={{ padding: 10, borderRadius: 4, backgroundColor: '#00bcd4', color: '#000', fontWeight: 'bold' }}>
          Login
        </button>
      </form>
      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}
