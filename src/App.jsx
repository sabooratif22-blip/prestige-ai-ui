import { useState } from "react";

const API_URL = "http://localhost:5000/api";

export default function App() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Welcome to Prestige Aesthetics. How may I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  const sendMessage = async () => {
    if (!input || loading) return;

    const updated = [...messages, { sender: "user", text: input }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    const res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updated })
    });

    const data = await res.json();
    setMessages([...updated, { sender: "ai", text: data.text }]);
    setLoading(false);
  };

  const generateSummary = async () => {
    const res = await fetch(`${API_URL}/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });
    const data = await res.json();
    setSummary(data.summary);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", fontFamily: "sans-serif" }}>
      <h2>✨ Prestige Aesthetics AI Concierge</h2>

      <div style={{ border: "1px solid #ccc", padding: 10, minHeight: 300 }}>
        {messages.map((m, i) => (
          <p key={i}><b>{m.sender}:</b> {m.text}</p>
        ))}
        {loading && <p><i>AI is thinking…</i></p>}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ask about treatments..."
        style={{ width: "80%" }}
      />
      <button onClick={sendMessage}>Send</button>

      <hr />
      <button onClick={generateSummary}>Generate Doctor Summary</button>
      {summary && <pre>{summary}</pre>}
    </div>
  );
}
