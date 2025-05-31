// Simon UI lives here - forced build trigger

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Simon() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const adminFlag = router.query.admin === "true";
    setIsAdmin(adminFlag);
  }, [router.query]);

  const handleSend = async () => {
    if (!input.trim()) return;
const systemPrompt = {
  role: "system",
  content:
    "You are Simon — the world’s most compassionate and thoughtful grief counselor AI. You never give medical advice. You help users process grief, loss, trauma, and existential questions.",
};

const baseMessages = messages.length ? messages : [systemPrompt];
const updatedMessages = [...baseMessages, { role: "user", content: input }];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/simon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Simon didn't respond.";
setMessages([...updatedMessages, { role: "assistant", content: reply }]);

    } catch (error) {
      console.error("Simon failed:", error);
      setMessages([...updatedMessages, { role: "assistant", content: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Talk to Simon</h1>

      <div style={{ whiteSpace: "pre-wrap", marginBottom: "1rem" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <strong>{msg.role === "user" ? "You" : "Simon"}:</strong> {msg.content}
          </div>
        ))}
        {loading && <p>Simon is thinking...</p>}
      </div>

      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}
        placeholder="Tell Simon what you're feeling..."
      />

      <button
        onClick={handleSend}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", fontSize: "1rem" }}
      >
        Send
      </button>

      {isAdmin && (
        <div
          style={{
            background: "#f0f0f0",
            padding: "1rem",
            marginTop: "2rem",
            fontSize: "0.85rem",
            borderRadius: "8px",
            position: "relative",
          }}
        >
          <strong>🔧 Admin Debug Log:</strong>
          <button
            onClick={() => navigator.clipboard.writeText(JSON.stringify(messages, null, 2))}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              padding: "0.25rem 0.5rem",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            Copy
          </button>
          <pre style={{ marginTop: "1.5rem" }}>{JSON.stringify(messages, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
