import { useNavigate } from "react-router-dom";
import "../styles/chat.css";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const createNewChat = () => ({
  id: Date.now(),
  title: "New Farmer Chat",
  messages: [
    {
      sender: "bot",
      text: "🌱 **New chat started**\n\nHow can I help you today?",
    },
  ],
});

function ChatBox() {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [sessions, setSessions] = useState([
    {
      id: Date.now(),
      title: "New Farmer Chat",
      messages: [
        {
          sender: "bot",
          text: "🌾 **Welcome to KrishiAI**\n\nAsk me about crops, diseases, fertilizers, or farming tips.",
        },
      ],
    },
  ]);

  const [activeId, setActiveId] = useState(sessions[0].id);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pastChats, setPastChats] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const activeChat = sessions.find((s) => s.id === activeId) || sessions[0];
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchHistory();
    } else {
      setPastChats([]);
    }
  }, [token]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("http://localhost:5000/api/chat/history", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (data.success) {
        setPastChats(data.history);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err.message);
    }
    setLoadingHistory(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setPastChats([]);
  };

  const openPastChat = (chatItem) => {
    const newSession = {
      id: Date.now(),
      title: chatItem.question.slice(0, 30),
      messages: [
        { sender: "user", text: chatItem.question },
        { sender: "bot", text: chatItem.answer },
      ],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveId(newSession.id);
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleMic = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input not supported. Please use Chrome.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      if (event.error !== "no-speech") {
        console.error("Mic error:", event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat]);

  const newChat = () => {
    const newSession = createNewChat();
    setSessions((prev) => [newSession, ...prev]);
    setActiveId(newSession.id);
  };

  const generateTitle = (text) => {
    return text
      .split(" ")
      .slice(0, 5)
      .join(" ")
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    const currentMessage = message;
    setMessage("");
    setLoading(true);

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeId ? { ...s, messages: [...s.messages, userMsg] } : s
      )
    );

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = "Bearer " + token;
      }

      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ question: currentMessage }),
      });

      const data = await res.json();

      const botMsg = {
        sender: "bot",
        text: data.answer || data.message || "No response from AI.",
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? {
                ...s,
                title: generateTitle(currentMessage),
                messages: [...s.messages, botMsg],
              }
            : s
        )
      );

      if (token) {
        fetchHistory();
      }
    } catch {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? {
                ...s,
                messages: [
                  ...s.messages,
                  { sender: "bot", text: "❌ Server error." },
                ],
              }
            : s
        )
      );
    }

    setLoading(false);
  };

  const deleteChat = (id) => {
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        if (id === activeId) {
          setActiveId(remaining[0].id);
        }
        return remaining;
      }
      const newSession = createNewChat();
      setActiveId(newSession.id);
      return [newSession];
    });
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <button className="new-chat" onClick={newChat}>
          ➕ New Chat
        </button>

        <input
          className="search"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="chat-history">
          {filteredSessions.map((s) => (
            <div
              key={s.id}
              className={`history-item ${s.id === activeId ? "active" : ""}`}
            >
              <span className="history-title" onClick={() => setActiveId(s.id)}>
                {s.title}
              </span>
              <span
                className="delete-chat"
                onClick={() => deleteChat(s.id)}
                title="Delete chat"
              >
                🗑
              </span>
            </div>
          ))}

          {user && (
            <>
              <div style={{ color: "#9bb89f", fontSize: "12px", margin: "12px 0 6px 4px" }}>
                {loadingHistory ? "Loading history..." : "Saved History"}
              </div>
              {pastChats.map((chat) => (
                <div
                  key={chat._id}
                  className="history-item"
                  onClick={() => openPastChat(chat)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="history-title">
                    {chat.question.slice(0, 28)}
                  </span>
                </div>
              ))}
              {!loadingHistory && pastChats.length === 0 && (
                <div style={{ color: "#6b8570", fontSize: "12px", padding: "4px" }}>
                  No saved chats yet
                </div>
              )}
            </>
          )}
        </div>

        {user ? (
          <div
            className="profile"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
              title="View Profile"
            >
              👤 {user.name}
            </span>
            <span
              onClick={handleLogout}
              style={{ cursor: "pointer", fontSize: "13px", opacity: 0.8 }}
              title="Logout"
            >
              🚪 Logout
            </span>
          </div>
        ) : (
          <div
            className="profile"
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            👤 Login
          </div>
        )}
      </aside>

      <main className="chat-area">
        <header className="chat-header">
          <div>
            🌾 KrishiAI
            <span>Your smart agriculture companion</span>
          </div>
        </header>

        <section className="chat-body">
          {activeChat.messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-bubble ${
                msg.sender === "user" ? "user-bubble" : "bot-bubble"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
              {msg.sender === "bot" && (
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(msg.text, i)}
                >
                  {copiedIndex === i ? "✅ Copied!" : "📋 Copy"}
                </button>
              )}
            </div>
          ))}

          {loading && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          <div ref={chatEndRef} />
        </section>

        <footer className="chat-input">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isListening ? "🎤 Listening..." : "Ask about your crops..."}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className={`mic-btn ${isListening ? "listening" : ""}`}
            onClick={handleMic}
            title={isListening ? "Listening..." : "Voice input"}
          >
            {isListening ? "🔴" : "🎤"}
          </button>
          <button onClick={sendMessage}>Send</button>
        </footer>
      </main>
    </div>
  );
}

export default ChatBox;