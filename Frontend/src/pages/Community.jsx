import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Navigation } from "../components/Navigate";

import { 
  MessageCircle, 
  UserPlus, 
  Send, 
  Users, 
  Bell, 
  Check, 
  Search
} from "lucide-react";

export const Community = () => {
  const { user, token } = useContext(AuthContext);

  const [allUsers, setAllUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const messagesEndRef = useRef(null);
 const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Helper to scroll to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  // ---------------- Fetch All Data ----------------
  const fetchData = async () => {
    if (!token) return;

    try {
      const [usersRes, friendsRes, reqRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/community/all-users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/community/friends`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/community/requests`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setAllUsers(usersRes.data.users || []);
      setFriends(friendsRes.data.friends || []);
      setRequests(reqRes.data.requests || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // ---------------- Chat Functions ----------------

  const loadChat = async (friendId, shouldScroll = true) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/community/chat/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(res.data.messages || []);
      
      if (shouldScroll) {
        scrollToBottom();
      }
    } catch (err) {
      console.error("Error loading chat:", err);
    }
  };

  // Polling Effect
  useEffect(() => {
    let interval;
    if (selected && token) {
      interval = setInterval(() => {
        loadChat(selected._id, false); 
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [selected, token]);


  // ---------------- Actions ----------------
  const sendRequest = async (id) => {
    try {
      await axios.post(
        `${API_BASE_URL}/community/send-request/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  const acceptRequest = async (senderId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/community/accept-request/${senderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !selected) return;

    const myMessage = {
      sender: user._id,
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, myMessage]);
    setText("");
    scrollToBottom(); 

    try {
      await axios.post(
        `${API_BASE_URL}}/community/chat/${selected._id}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadChat(selected._id, false);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);


  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navigation user={user} />

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 p-6 h-[calc(100vh-80px)]">

        {/* LEFT SIDEBAR - Discover + Requests */}
        <div className="col-span-3 bg-white rounded-2xl shadow-sm border border-gray-950 overflow-hidden flex flex-col">

          <div className="p-5 border-b bg-gradient-to-r from-white to-gray-50">
            <h2 className="font-bold text-xl flex items-center gap-2">
              <Users className="text-pink-500" size={20} /> Community
            </h2>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-6">

            {/* Friend Requests */}
            {requests.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <Bell size={14} className="text-orange-500" /> Requests
                </h3>

                <div className="space-y-3">
                  {requests.map((req) => (
                    <div key={req._id} className="p-3 rounded-xl bg-orange-50">
                      <p className="font-bold">{req.firstname} {req.lastname}</p>
                      <button
                        onClick={() => acceptRequest(req._id)}
                        className="w-full mt-2 bg-orange-500 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        <Check size={14} /> Accept
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discover */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <Search size={14} /> Discover
              </h3>

              <div className="space-y-3">
                {allUsers.map((u) => (
                  <div
                    key={u._id}
                    className="p-3 rounded-xl hover:bg-gray-50 transition flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{u.firstname} {u.lastname}</p>
                    </div>

                    <button
                      onClick={() => sendRequest(u._id)}
                      className="p-2 rounded-full hover:bg-pink-100 text-pink-600"
                    >
                      <UserPlus size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* CENTER CHAT WINDOW */}
        <div className="col-span-6 bg-white rounded-2xl shadow-sm border flex flex-col overflow-hidden">

          {!selected ? (
            <div className="h-full flex flex-col justify-center items-center text-gray-400">
              <MessageCircle size={60} className="text-pink-300 mb-4" />
              <p className="text-lg font-semibold">Select a friend to start chatting</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b bg-white flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                  {selected.firstname[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{selected.firstname}</p>
                  <p className="text-xs text-green-500">● Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-[#F9FAFB]">
                {messages.map((m, i) => {
                  const isMe = m.sender === user._id;

                  return (
                    <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`px-4 py-3 max-w-[70%] rounded-2xl shadow text-sm 
                          ${isMe
                            ? "bg-pink-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 border rounded-bl-none"
                          }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t">
                <div className="flex gap-2 bg-gray-50 p-2 rounded-full border focus-within:border-pink-400">
                  <input
                    className="flex-grow px-3 bg-transparent outline-none"
                    placeholder="Type your message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />

                  <button
                    onClick={sendMessage}
                    disabled={!text.trim()}
                    className={`p-3 rounded-full ${
                      text.trim()
                        ? "bg-pink-500 text-white hover:scale-105"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDEBAR - Friends */}
        <div className="col-span-3 bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-5 border-b bg-gradient-to-r from-white to-gray-50">
            <h2 className="font-bold text-xl flex items-center gap-2">
              <MessageCircle className="text-orange-500" size={20} /> Friends
            </h2>
          </div>

          <div className="flex-grow p-4 overflow-y-auto">
            {friends.map((f) => {
              // Check if this friend is the one currently selected
              const isSelected = selected?._id === f._id;

              return (
                <div
                  key={f._id}
                  onClick={() => {
                    setSelected(f);
                    loadChat(f._id, true);
                  }}
                  className={`p-3 rounded-xl mb-2 cursor-pointer transition 
                    ${
                      isSelected
                        ? "bg-pink-50 shadow-inner"
                        : "hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold border">
                      {f.firstname[0]}
                    </div>

                    <div>
                      <p className="font-semibold text-sm">{f.firstname} {f.lastname}</p>
                      
                      {/* CONDITIONAL RENDERING FOR TEXT */}
                      <p className={`text-[10px] ${isSelected ? 'text-pink-500 font-bold' : 'text-gray-400'}`}>
                        {isSelected ? "Active now" : "Tap to chat"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};