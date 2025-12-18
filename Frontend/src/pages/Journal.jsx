import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { Navigation } from "../components/Navigate";
import { AuthContext } from "../context/AuthContext";
import { BookOpen, Trash2, Mic, MicOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Journal = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [journals, setJournals] = useState([]);
  const [title, setTitle] = useState("");

  // Speech states
  const [finalText, setFinalText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ---------------- SPEECH SETUP ----------------
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          final += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      setFinalText((prev) => prev + final);
      setInterimText(interim);
    };

    recognitionRef.current = recognition;
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    setInterimText("");
  };

  // ---------------- AUTH ----------------
  useEffect(() => {
    if (!token) navigate("/signin");
  }, [token]);

  const authHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  // ---------------- LOAD JOURNALS ----------------
  const loadJournals = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/journal`, {
        headers: authHeaders(),
      });
      setJournals(res.data.journals);
    } catch (err) {
      if (err.response?.status === 403) navigate("/signin");
    }
  };

  useEffect(() => {
    if (token) loadJournals();
  }, [token]);

  // ---------------- ADD JOURNAL ----------------
  const addJournal = async () => {
    const content = finalText + interimText;
    if (!content.trim()) return;

    try {
      await axios.post(
        `${API_BASE_URL}/user/journal`,
        { title, content },
        { headers: { ...authHeaders(), "Content-Type": "application/json" } }
      );

      setFinalText("");
      setInterimText("");
      setTitle("");
      loadJournals();
    } catch (err) {
      if (err.response?.status === 403) navigate("/signin");
    }
  };

  // ---------------- DELETE JOURNAL ----------------
  const deleteJournal = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/user/journal/${id}`, {
        headers: authHeaders(),
      });
      loadJournals();
    } catch (err) {
      if (err.response?.status === 403) navigate("/signin");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="text-pink-500" /> My Journal
        </h1>

        {/* JOURNAL INPUT */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <input
            type="text"
            placeholder="Journal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg mb-3"
          />

          <textarea
            placeholder="Write or speak your thoughts..."
            value={finalText + interimText}
            onChange={(e) => {
              setFinalText(e.target.value);
              setInterimText("");
            }}
            className="w-full h-40 p-3 border rounded-lg"
          />

          {/* SPEECH BUTTON */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold ${
                isRecording ? "bg-red-500" : "bg-indigo-600"
              }`}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              {isRecording ? "Stop Recording" : "Speak Journal"}
            </button>

            {isRecording && (
              <span className="text-sm text-red-500 animate-pulse">
                Listening...
              </span>
            )}
          </div>

          <button
            onClick={addJournal}
            className="mt-5 px-5 py-2 rounded-md bg-pink-500 text-white font-bold hover:bg-pink-600"
          >
            Add Entry
          </button>
        </div>

        {/* JOURNAL LIST */}
        <div className="space-y-4">
          {journals.length === 0 && (
            <p className="text-gray-500 italic">No journal entries yet.</p>
          )}

          {journals.map((entry) => (
            <div
              key={entry._id}
              className="bg-white p-6 rounded-xl shadow flex justify-between items-start border"
            >
              <div>
                <h2 className="text-xl font-semibold">{entry.title}</h2>
                <p className="text-gray-600 mt-2 whitespace-pre-line">
                  {entry.content}
                </p>
                <p className="text-xs text-gray-400 mt-3">
                  Posted {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => deleteJournal(entry._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
