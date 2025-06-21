import { useEffect, useState } from 'react';

interface LogEntry {
  timestamp: string;
  userId: string;
  messages: { role: string; content: string }[];
  reply: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [userFilter, setUserFilter] = useState('');
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    async function fetchLogs() {
      const res = await fetch('/api/logs');
      const raw = await res.text();

      const entries = raw
        .split('\n')
        .filter(Boolean)
        .map(line => {
          try {
            return JSON.parse(line.replace(/,$/, ''));
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      setLogs(entries as LogEntry[]);
    }

    fetchLogs();
  }, []);

  useEffect(() => {
    setFilteredLogs(
      userFilter
        ? logs.filter(log => log.userId.includes(userFilter))
        : logs
    );
  }, [logs, userFilter]);

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff' }}>
      <h1>Simon Log Viewer</h1>
      <input
        placeholder="Filter by userId"
        value={userFilter}
        onChange={e => setUserFilter(e.target.value)}
        style={{ padding: 8, marginBottom: 20, width: '300px' }}
      />

      {filteredLogs.map((log, index) => (
        <div key={index} style={{ border: '1px solid #444', padding: 16, marginBottom: 12 }}>
          <div><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</div>
          <div><strong>User:</strong> {log.userId}</div>
          <div style={{ marginTop: 10 }}>
            <strong>User said:</strong>
            <pre>{log.messages.map(m => m.role === 'user' ? m.content : '').filter(Boolean).join('\n')}</pre>
          </div>
          <div style={{ marginTop: 10 }}>
            <strong>Simon replied:</strong>
            <pre>{log.reply}</pre>
          </div>
        </div>
      ))}
    </div>
  );
}
