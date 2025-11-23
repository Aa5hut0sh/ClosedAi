import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  MoreVertical, 
  ArrowUp 
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import { Navigation } from "../components/Navigate";

// --- BOUNCING TYPING DOTS ---
const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-4 bg-white rounded-2xl rounded-tl-none shadow-sm border border-gray-100 w-fit">
    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
  </div>
);

// --- PRE-DEFINED FRONTEND AI REPLIES ---
const getBotReply = (msg) => {
  const text = msg.toLowerCase();

  const rules = [
    { key: ["sad", "depressed", "down"], reply: "I'm really sorry you're feeling this way. I'm here for you. Want to talk about what's hurting you the most right now?" },

    { key: ["anxious", "anxiety", "panic"], reply: "Take a deep breath. You're safe. Try inhaling for 4 seconds and exhaling for 6. Want a calming exercise?" },

    { key: ["sleep", "insomnia"], reply: "Sleep can be tough. I can give you some calming routines or relaxing tips if you'd like." },

    { key: ["angry", "frustrated"], reply: "It's okay to feel angry. I'm here if you want to talk about what triggered it." },

    { key: ["stress", "pressure"], reply: "Stress can feel heavy. Let’s break it down together. What’s the biggest worry right now?" },

    { key: ["hello", "hi", "hey"], reply: "Hi there! How are you feeling today? 😊" },

    { key: ["thanks", "thank you"], reply: "You're welcome! I'm always here for you." },

    { key: ["help"], reply: "Of course. Tell me what's bothering you, and we’ll work through it." }
  ];

  for (let r of rules) {
    if (r.key.some((k) => text.includes(k))) return r.reply;
  }

  return "I understand. Can you tell me a little more about what you're feeling right now?";
};

export const AIChatbot = () => {
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { 
      role: "bot", 
      text: "Hello! I'm your personal mental wellness assistant. How are you feeling right now?", 
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "I'm feeling anxious 😰",
    "Help me sleep better 🌙",
    "I had a bad day 😔",
    "Practice mindfulness 🧘"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [messages, loading]);

  // --- SEND MESSAGE WITH PREDEFINED REPLIES ---
  const sendMessage = async (textOverride = null) => {
    const textToSend = textOverride || input;

    if (!textToSend.trim()) return;

    const userMessage = {
      role: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate typing delay
    setTimeout(() => {
      const botText = getBotReply(textToSend);

      const botMessage = {
        role: "bot",
        text: botText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 1200);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFE]">

      {/* Background Lights */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-100 blur-3xl opacity-60 rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-50 blur-3xl opacity-60 rounded-full"></div>
      </div>

      <Navigation user={user} />

      <div className="flex items-center justify-center p-4 md:p-8 h-[calc(100vh-80px)]">

        {/* Chat Body */}
        <div className="w-full max-w-4xl h-full bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl border border-white/40 flex flex-col overflow-hidden">

          {/* HEADER */}
          <div className="px-6 py-4 bg-white/50 border-b flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <Bot className="text-white w-6 h-6" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-white rounded-full"></span>
              </div>

              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  Serene AI <Sparkles className="w-4 h-4 text-yellow-500" />
                </h2>
                <p className="text-xs text-gray-500">Always here to support you</p>
              </div>
            </div>

            <MoreVertical size={20} className="text-gray-400" />
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar */}
                <div>
                  {msg.role === "bot" ? (
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Bot size={16} className="text-indigo-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <User size={16} className="text-orange-600" />
                    </div>
                  )}
                </div>

                {/* Text Bubble */}
                <div className={`flex flex-col max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-5 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gray-900 text-white rounded-tr-none"
                        : "bg-white border border-gray-200 rounded-tl-none text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-indigo-600" />
                </div>
                <TypingIndicator />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="p-6 bg-white border-t">

            {/* Suggestions */}
            {messages.length < 3 && (
              <div className="flex gap-2 pb-4 overflow-x-auto">
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-indigo-50 rounded-full border border-gray-200 whitespace-nowrap"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-end bg-gray-100 border border-gray-300 rounded-2xl p-2">
              
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
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
              AI may make mistakes — verify important information.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
