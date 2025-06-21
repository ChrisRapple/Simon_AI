import { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function SimonPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const userId = 'demo-user-001';
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const updatedMessages: Message[] = [...messages, { role: 'user', content: trimmedInput }];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/simon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, messages: updatedMessages }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
      } else {
        throw new Error('No reply field in response.');
      }
    } catch (error) {
      console.error('Error contacting Simon:', error);
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: '⚠️ Simon is unavailable right now. Please try again later.',
        },
      ]);
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
        <div ref={bottomRef} />
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
          aria-label="Message input"
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
          disabled={loading}
          style={{
            backgroundColor: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
