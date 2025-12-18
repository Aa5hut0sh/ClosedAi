import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import {
  Bot,
  User,
  ArrowUp,
  Sparkles,
  MoreVertical,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import { Navigation } from "../components/Navigate";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ---------------- TYPING INDICATOR ----------------
const TypingIndicator = () => (
  <div className="flex gap-1 px-4 py-3 bg-white border rounded-2xl rounded-tl-none shadow-sm w-fit">
    <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
  </div>
);

// ---------------- CHATBOT PAGE ----------------
export const AIChatbot = () => {
  const { user, token } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your mental wellness assistant 🌱 How are you feeling today?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "I'm feeling anxious 😰",
    "I had a bad day 😔",
    "Help me sleep better 🌙",
    "Give me a calming exercise 🧘",
  ];

  const authHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  // ---------------- SCROLL ----------------
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);

  // ---------------- LOAD CHAT HISTORY ----------------
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/chatbot/history`, {
          headers: authHeaders(),
        });

        if (res.data.messages && res.data.messages.length > 0) {
          const formatted = res.data.messages.map((m) => ({
            role: m.role,
            text: m.text,
            time: new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

          setMessages(formatted);
        }
      } catch (err) {
        console.error("Failed to load chat history");
      }
    };

    if (token) loadHistory();
  }, [token]);

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = async (textOverride = null) => {
    const textToSend = textOverride ?? input;
    if (!textToSend.trim()) return;

    const userMsg = {
      role: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/chatbot`,
        { message: textToSend },
        { headers: authHeaders() }
      );

      const botMsg = {
        role: "bot",
        text: res.data.reply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            "I'm having trouble responding right now. Please try again in a moment 🙏",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFE]">
      <Navigation user={user} />

      <div className="flex justify-center items-center p-4 md:p-8 h-[calc(100vh-80px)]">
        <div className="w-full max-w-4xl h-full bg-white/80 backdrop-blur-xl border rounded-3xl shadow-xl flex flex-col overflow-hidden">

          {/* HEADER */}
          <div className="px-6 py-4 border-b flex justify-between items-center bg-white/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Bot className="text-white" />
              </div>
              <div>
                <h2 className="font-bold flex items-center gap-1">
                  Aroha - ChatBot <Sparkles size={16} className="text-yellow-500" />
                </h2>
                <p className="text-xs text-gray-500">Your safe space</p>
              </div>
            </div>
            <MoreVertical className="text-gray-400" />
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                  {msg.role === "user" ? (
                    <User size={16} className="text-orange-600" />
                  ) : (
                    <Bot size={16} className="text-indigo-600" />
                  )}
                </div>

                <div
                  className={`max-w-[75%] flex flex-col ${
                    msg.role === "user" ? "items-end" : ""
                  }`}
                >
                  <div
                    className={`px-5 py-3 rounded-2xl text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-gray-900 text-white rounded-tr-none"
                        : "bg-white border rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                  <Bot size={16} className="text-indigo-600" />
                </div>
                <TypingIndicator />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-6 border-t bg-white">
            {messages.length < 3 && (
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="px-4 py-2 text-sm bg-gray-100 border rounded-full hover:bg-indigo-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-end bg-gray-100 border rounded-2xl p-2">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 bg-transparent outline-none resize-none p-3 text-gray-700"
              />

              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className={`p-3 rounded-full ${
                  input.trim() && !loading
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ArrowUp size={18} />
              </button>
            </div>

            <p className="text-[10px] text-center mt-2 text-gray-400">
              This AI provides emotional support, not medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
