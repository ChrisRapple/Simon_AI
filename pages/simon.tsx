import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function SimonPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/simon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ Simon is unavailable right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#1E1E1E',
      color: '#FFFFFF',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#333' : '#2196F3',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: '16px',
              maxWidth: '70%',
              whiteSpace: 'pre-wrap'
            }}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div style={{
            backgroundColor: '#2196F3',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '16px',
            maxWidth: '70%'
          }}>
            Simon is typing...
          </div>
        )}
      </div>

      <div style={{
        padding: '16px',
        borderTop: '1px solid #333',
        display: 'flex',
        backgroundColor: '#1E1E1E'
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #555',
            backgroundColor: '#2A2A2A',
            color: '#fff',
            marginRight: '8px'
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            backgroundColor: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
