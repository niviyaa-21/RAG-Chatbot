import { useState, useRef, useEffect } from "react";

const API_URL = "http://localhost:8000";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #f4f6f9; }

  /* TOP NAV */
  .navbar {
    background: white; border-bottom: 1px solid #e5e7eb;
    padding: 0 40px; display: flex; align-items: center; gap: 16px; height: 56px;
    position: sticky; top: 0; z-index: 10;
  }
  .nav-back { display: flex; align-items: center; gap: 6px; background: none; border: none; font-size: 14px; color: #374151; cursor: pointer; font-family: 'Inter', sans-serif; padding: 6px 8px; border-radius: 6px; }
  .nav-back:hover { background: #f3f4f6; }
  .nav-divider { width: 1px; height: 20px; background: #e5e7eb; }
  .nav-logo { width: 32px; height: 32px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; }
  .nav-title { font-size: 16px; font-weight: 600; color: #111827; flex: 1; }
  .live-badge { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 20px; padding: 3px 10px; font-size: 12px; font-weight: 600; }
  .nav-bell { margin-left: auto; background: none; border: none; cursor: pointer; font-size: 18px; color: #6b7280; padding: 6px; border-radius: 6px; }
  .nav-bell:hover { background: #f3f4f6; }

  /* TABS */
  .tabs-bar { background: white; border-bottom: 1px solid #e5e7eb; padding: 0 40px; display: flex; gap: 0; }
  .tab { display: flex; align-items: center; gap: 8px; padding: 16px 20px; border: none; background: none; font-size: 14px; font-weight: 500; color: #6b7280; cursor: pointer; font-family: 'Inter', sans-serif; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: color 0.2s; }
  .tab:hover { color: #374151; }
  .tab.active { color: #2563eb; border-bottom-color: #2563eb; }
  .tab-icon { font-size: 15px; }

  /* PAGE CONTENT */
  .content { max-width: 1000px; margin: 0 auto; padding: 32px 40px; }

  /* UPLOAD TAB */
  .info-banner { display: flex; align-items: flex-start; gap: 10px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px; font-size: 13px; color: #1e40af; line-height: 1.6; }
  .info-banner strong { font-weight: 600; }

  .drop-zone {
    border: 2px dashed #d1d5db; border-radius: 12px; padding: 64px 24px;
    text-align: center; cursor: pointer; background: white; transition: border-color 0.2s, background 0.2s;
  }
  .drop-zone:hover, .drop-zone.drag { border-color: #2563eb; background: #eff6ff; }
  .drop-icon { width: 56px; height: 56px; background: #f3f4f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 22px; }
  .drop-zone h3 { font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 6px; }
  .drop-zone p { font-size: 13px; color: #6b7280; margin-bottom: 20px; }
  .drop-tags { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
  .drop-tag { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 20px; padding: 5px 14px; font-size: 13px; color: #374151; font-weight: 500; }
  .drop-tag.highlight { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; }
  .drop-zone input { display: none; }

  .file-list { margin-top: 16px; display: flex; flex-direction: column; gap: 8px; }
  .file-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: white; border-radius: 10px; border: 1px solid #e5e7eb; }
  .file-item-icon { font-size: 18px; }
  .file-item-name { flex: 1; font-size: 14px; font-weight: 500; color: #111827; }
  .file-item-status { font-size: 12px; font-weight: 600; }
  .file-item-status.success { color: #16a34a; }
  .file-item-status.uploading { color: #2563eb; }
  .file-item-status.error { color: #dc2626; }

  .doc-library { margin-top: 36px; }
  .doc-library h3 { font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 20px; }
  .doc-empty { text-align: center; padding: 48px 24px; color: #9ca3af; }
  .doc-empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.4; }
  .doc-empty p { font-size: 14px; }
  .doc-empty span { font-size: 13px; }
  .doc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
  .doc-card { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: white; border-radius: 10px; border: 1px solid #e5e7eb; }
  .doc-card span { font-size: 13px; color: #374151; font-weight: 500; }

  /* CHAT TAB */
  .chat-page { display: flex; flex-direction: column; height: calc(100vh - 113px); }

  .chat-banner { display: flex; align-items: center; gap: 10px; background: #f5f3ff; border: 1px solid #e9d5ff; border-radius: 10px; padding: 12px 18px; margin-bottom: 24px; font-size: 13px; color: #6d28d9; font-weight: 500; }

  .chat-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; padding-bottom: 16px; }

  .chat-msg { display: flex; gap: 12px; max-width: 75%; }
  .chat-msg.user { align-self: flex-end; flex-direction: row-reverse; }
  .chat-msg.bot { align-self: flex-start; }

  .chat-avatar { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .chat-avatar.bot { background: #2563eb; color: white; }
  .chat-avatar.user { background: #e5e7eb; color: #374151; font-size: 13px; font-weight: 600; }

  .chat-bubble { padding: 14px 18px; border-radius: 16px; font-size: 14px; line-height: 1.7; }
  .chat-bubble.bot { background: white; color: #111827; border-bottom-left-radius: 4px; border: 1px solid #e5e7eb; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
  .chat-bubble.user { background: #2563eb; color: white; border-bottom-right-radius: 4px; }
  .chat-bubble.bot strong { font-weight: 600; color: #111827; }
  .chat-bubble.bot ul { padding-left: 18px; margin: 6px 0; }
  .chat-bubble.bot li { margin-bottom: 4px; }
  .chat-bubble.bot .md-section { margin-bottom: 12px; }
  .chat-bubble.bot .md-heading { font-weight: 600; font-size: 14px; color: #111827; margin-bottom: 4px; }

  .chat-sources { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 5px; }
  .chat-source-tag { font-size: 11px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 10px; padding: 2px 8px; font-weight: 500; }
  .chat-sources-label { font-size: 11px; color: #9ca3af; width: 100%; margin-bottom: 2px; }

  .typing { display: flex; gap: 4px; padding: 4px 0; }
  .typing span { width: 7px; height: 7px; background: #d1d5db; border-radius: 50%; animation: bounce 1.2s infinite; }
  .typing span:nth-child(2) { animation-delay: 0.2s; }
  .typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

  .suggestions-section { margin-bottom: 20px; }
  .suggestions-label { font-size: 13px; color: #6b7280; font-weight: 500; margin-bottom: 10px; }
  .suggestions-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .suggestion-chip { background: white; border: 1px solid #d1d5db; border-radius: 20px; padding: 7px 14px; font-size: 13px; color: #374151; cursor: pointer; font-family: 'Inter', sans-serif; transition: border-color 0.2s, color 0.2s; }
  .suggestion-chip:hover { border-color: #2563eb; color: #2563eb; }

  .chat-input-wrap { background: white; border: 1px solid #e5e7eb; border-radius: 12px; display: flex; align-items: center; padding: 4px 4px 4px 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  .chat-input-wrap textarea { flex: 1; border: none; outline: none; font-family: 'Inter', sans-serif; font-size: 14px; color: #111827; resize: none; max-height: 100px; line-height: 1.5; background: transparent; padding: 8px 0; }
  .chat-input-wrap textarea::placeholder { color: #9ca3af; }
  .send-btn { width: 36px; height: 36px; background: #2563eb; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s; }
  .send-btn:hover { background: #1d4ed8; }
  .send-btn:disabled { background: #bfdbfe; cursor: not-allowed; }
  .send-btn svg { width: 16px; height: 16px; fill: white; }

  .chat-hint { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 10px; }
`;

const SUGGESTIONS = [
  "What is the annual leave policy?",
  "How many sick leave days do I get?",
  "What is the notice period for resignation?",
  "What are the WFH guidelines?",
  "What health insurance benefits do we have?",
  "How does the performance review work?",
  "What tools does SWS AI use for communication?",
  "What is the IT password policy?",
];

const EXISTING_DOCS = [
  "leave-policy", "wfh-policy", "hr-policy", "benefits-compensation",
  "code-of-conduct", "company-overview", "it-security-policy",
  "onboarding-guide", "performance-review", "resignation-policy",
];

function renderMarkdown(text) {
  return text.split("\n").map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={j}>{part.slice(2, -2)}</strong>
        : part
    );
    if (line.startsWith("- ") || line.startsWith("• ")) {
      return <li key={i}>{parts.map((p, j) => typeof p === "string" ? p.replace(/^[-•] /, "") : p)}</li>;
    }
    return <p key={i} style={{marginBottom: 4}}>{parts}</p>;
  });
}

export default function App() {
  const [tab, setTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

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
      setMessages((prev) => [...prev, { role: "bot", text: data.answer, sources: data.sources }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I couldn't connect to the server.", sources: [] }]);
    } finally {
      setLoading(false);
    }
  }

  async function uploadFile(file) {
    if (!file.name.endsWith(".pdf")) return;
    const id = Date.now();
    setUploadedFiles((prev) => [...prev, { id, name: file.name, status: "uploading" }]);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_URL}/api/upload`, { method: "POST", body: formData });
      const data = await res.json();
      setUploadedFiles((prev) => prev.map((f) => f.id === id ? { ...f, status: data.success ? "success" : "error" } : f));
    } catch {
      setUploadedFiles((prev) => prev.map((f) => f.id === id ? { ...f, status: "error" } : f));
    }
  }

  function handleFiles(files) { Array.from(files).forEach(uploadFile); }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  return (
    <>
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-divider" />
        <div className="nav-logo">📄</div>
        <span className="nav-title">SWS AI Document Hub</span>
        <span className="live-badge">LIVE DEMO</span>
        <button className="nav-bell">🔔</button>
      </nav>

      {/* TABS BAR */}
      <div className="tabs-bar">
        <button className={`tab ${tab === "upload" ? "active" : ""}`} onClick={() => setTab("upload")}>
          <span className="tab-icon">⬆</span> Document Upload
        </button>
        <button className={`tab ${tab === "chat" ? "active" : ""}`} onClick={() => setTab("chat")}>
          <span className="tab-icon">💬</span> AI Assistant
        </button>
      </div>

      <div className="content">

        {/* UPLOAD TAB */}
        {tab === "upload" && (
          <>
            <div className="info-banner">
              ℹ️ <span><strong>Simulated demo</strong> — files are processed client-side only, nothing is stored. Upload <strong>1–3 files</strong> to see individual per-file progress bars. Upload <strong>4 or more files</strong> to trigger the bulk notification flow.</span>
            </div>

            <div
              className={`drop-zone ${dragging ? "drag" : ""}`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
            >
              <div className="drop-icon">⬆</div>
              <h3>Drop files here or click to browse</h3>
              <p>Any file type · Up to 20 MB per file</p>
              <div className="drop-tags">
                <span className="drop-tag">Single file</span>
                <span className="drop-tag">Bulk upload</span>
                <span className="drop-tag highlight">Try 4+ files to trigger notifications</span>
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf" multiple onChange={(e) => handleFiles(e.target.files)} />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="file-list">
                {uploadedFiles.map((f) => (
                  <div key={f.id} className="file-item">
                    <span className="file-item-icon">📄</span>
                    <span className="file-item-name">{f.name}</span>
                    <span className={`file-item-status ${f.status}`}>
                      {f.status === "uploading" ? "Uploading..." : f.status === "success" ? "✓ Ingested" : "✗ Failed"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="doc-library">
              <h3>Document Library</h3>
              {uploadedFiles.filter(f => f.status === "success").length === 0 ? (
                <div className="doc-empty">
                  <div className="doc-empty-icon">📥</div>
                  <p>No documents yet</p>
                  <span>Upload files above — they'll appear here once complete</span>
                </div>
              ) : (
                <div className="doc-grid">
                  {uploadedFiles.filter(f => f.status === "success").map((f, i) => (
                    <div key={i} className="doc-card">
                      <span>📄</span>
                      <span>{f.name.replace(".pdf", "")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* CHAT TAB */}
        {tab === "chat" && (
          <div className="chat-page">
            <div className="chat-banner">
              💬 Powered by {EXISTING_DOCS.length} SWS AI company documents. Ask anything about company policies.
            </div>

            <div className="chat-messages">
              {/* Initial bot message always shown */}
              <div className="chat-msg bot">
                <div className="chat-avatar bot">💬</div>
                <div className="chat-bubble bot">
                  Hi! I'm the SWS AI company assistant. Ask me anything about our HR policies, leave, benefits, resignation process, WFH guidelines, or any other company policy.
                </div>
              </div>

              {messages.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.role}`}>
                  <div className={`chat-avatar ${msg.role}`}>
                    {msg.role === "bot" ? "💬" : "You"}
                  </div>
                  <div>
                    <div className={`chat-bubble ${msg.role}`}>{msg.role === "bot" ? <ul style={{listStyle:"none",padding:0}}>{renderMarkdown(msg.text)}</ul> : msg.text}</div>
                    {msg.role === "bot" && msg.sources?.length > 0 && (
                      <div className="chat-sources">
                        <span className="chat-sources-label">Sources used:</span>
                        {msg.sources.map((s, j) => (
                          <span key={j} className="chat-source-tag">📄 {s.replace(".pdf", "")}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="chat-msg bot">
                  <div className="chat-avatar bot">💬</div>
                  <div className="chat-bubble bot">
                    <div className="typing"><span /><span /><span /></div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {messages.length === 0 && (
              <div className="suggestions-section">
                <div className="suggestions-label">Try asking:</div>
                <div className="suggestions-list">
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="chat-input-wrap">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about policies, leave, benefits..."
                  rows={1}
                  disabled={loading}
                />
                <button className="send-btn" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </div>
              <div className="chat-hint">Answers sourced from SWS AI company documents only · Press Enter to send</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
