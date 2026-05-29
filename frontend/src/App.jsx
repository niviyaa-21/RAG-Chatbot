import { useState, useRef, useEffect } from "react";

const API_URL = "http://localhost:8000";

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Livvic', sans-serif; background: #f0f4f8; }

  .app { display: flex; flex-direction: column; height: 100vh; max-width: 860px; margin: 0 auto; }

  .header {
    background: #1a56db; color: white; padding: 16px 24px;
    display: flex; align-items: center; gap: 12px;
  }
  .header-logo {
    width: 36px; height: 36px; background: white; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; color: #1a56db; font-size: 14px;
  }
  .header h1 { font-size: 20px; font-weight: 600; }
  .header p { font-size: 13px; opacity: 0.8; margin-top: 2px; }

  .messages { flex: 1; overflow-y: auto; padding: 24px 20px; display: flex; flex-direction: column; gap: 16px; }

  .message { display: flex; gap: 12px; max-width: 80%; }
  .message.user { align-self: flex-end; flex-direction: row-reverse; }
  .message.bot { align-self: flex-start; }

  .avatar {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-weight: 600; font-size: 13px;
  }
  .avatar.bot { background: #1a56db; color: white; }
  .avatar.user { background: #e2e8f0; color: #475569; }

  .bubble {
    padding: 12px 16px; border-radius: 16px; font-size: 15px; line-height: 1.6;
  }
  .bubble.bot { background: white; color: #1e293b; border-bottom-left-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .bubble.user { background: #1a56db; color: white; border-bottom-right-radius: 4px; }

  .sources {
    margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px;
  }
  .source-tag {
    font-size: 11px; background: #eff6ff; color: #1d4ed8;
    border: 1px solid #bfdbfe; border-radius: 12px; padding: 3px 10px;
    font-weight: 500;
  }
  .sources-label { font-size: 11px; color: #94a3b8; width: 100%; margin-bottom: 2px; }

  .typing { display: flex; gap: 4px; padding: 14px 16px; }
  .typing span {
    width: 8px; height: 8px; background: #cbd5e1; border-radius: 50%;
    animation: bounce 1.2s infinite;
  }
  .typing span:nth-child(2) { animation-delay: 0.2s; }
  .typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

  .input-area {
    background: white; border-top: 1px solid #e2e8f0; padding: 16px 20px;
    display: flex; gap: 10px; align-items: flex-end;
  }
  .input-area textarea {
    flex: 1; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px;
    font-family: 'Livvic', sans-serif; font-size: 15px; resize: none;
    outline: none; max-height: 120px; line-height: 1.5;
    transition: border-color 0.2s;
  }
  .input-area textarea:focus { border-color: #1a56db; }
  .send-btn {
    background: #1a56db; color: white; border: none; border-radius: 12px;
    padding: 12px 20px; font-family: 'Livvic', sans-serif; font-size: 15px;
    font-weight: 600; cursor: pointer; white-space: nowrap;
    transition: background 0.2s;
  }
  .send-btn:hover { background: #1e40af; }
  .send-btn:disabled { background: #93c5fd; cursor: not-allowed; }

  .suggestions {
    padding: 0 20px 16px; display: flex; flex-wrap: wrap; gap: 8px;
  }
  .suggestion {
    background: white; border: 1px solid #e2e8f0; border-radius: 20px;
    padding: 6px 14px; font-size: 13px; color: #475569; cursor: pointer;
    font-family: 'Livvic', sans-serif; transition: border-color 0.2s, color 0.2s;
  }
  .suggestion:hover { border-color: #1a56db; color: #1a56db; }

  .welcome {
    text-align: center; padding: 40px 20px; color: #64748b;
  }
  .welcome h2 { font-size: 22px; color: #1e293b; margin-bottom: 8px; }
  .welcome p { font-size: 15px; line-height: 1.6; }
`;

const SUGGESTIONS = [
  "How many sick leaves do I get?",
  "What is the notice period for resignation?",
  "What are the WFH guidelines?",
  "How are performance reviews conducted?",
  "What is the password policy?",
  "Does SWS AI offer health insurance?",
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(question) {
    if (!question.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.answer, sources: data.sources },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, I couldn't connect to the server. Please try again.", sources: [] },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="header-logo">SWS</div>
          <div>
            <h1>SWS AI Policy Assistant</h1>
            <p>Ask anything about company policies</p>
          </div>
        </div>

        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome">
              <h2>👋 Hello! I'm your HR Policy Assistant</h2>
              <p>I can answer questions about SWS AI's policies — leaves, benefits, WFH, IT security, and more. Try one of the suggestions below or type your own question.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <div className={`avatar ${msg.role}`}>
                {msg.role === "bot" ? "AI" : "You"}
              </div>
              <div>
                <div className={`bubble ${msg.role}`}>{msg.text}</div>
                {msg.role === "bot" && msg.sources?.length > 0 && (
                  <div className="sources">
                    <span className="sources-label">Sources used:</span>
                    {msg.sources.map((s, j) => (
                      <span key={j} className="source-tag">
                        📄 {s.replace(".pdf", "")}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message bot">
              <div className="avatar bot">AI</div>
              <div className="bubble bot">
                <div className="typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 0 && (
          <div className="suggestions">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} className="suggestion" onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about leave, benefits, WFH policy..."
            rows={1}
            disabled={loading}
          />
          <button className="send-btn" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
            Send
          </button>
        </div>
      </div>
    </>
  );
}