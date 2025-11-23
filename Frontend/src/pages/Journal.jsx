import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Navigation } from "../components/Navigate";
import { AuthContext } from "../context/AuthContext";
import { BookOpen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Journal = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [journals, setJournals] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const apiBase = "http://127.0.0.1:3000/api/v1";

  // If user is NOT logged in → redirect
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token]);

  const authHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  // Fetch user's journals
  const loadJournals = async () => {
    try {
      const res = await axios.get(`${apiBase}/user/journal`, {
        headers: authHeaders(),
      });

      setJournals(res.data.journals);
    } catch (err) {
      console.log("Journal Fetch Error:", err);

      if (err.response?.status === 403) {
        navigate("/signin");
      }
    }
  };

  useEffect(() => {
    if (token) loadJournals();
  }, [token]);

  const addJournal = async () => {
    if (!content.trim()) return;

    try {
      await axios.post(
        `${apiBase}/user/journal`,
        { title, content },
        { headers: { ...authHeaders(), "Content-Type": "application/json" } }
      );

      setContent("");
      setTitle("");
      loadJournals();
    } catch (err) {
      console.log("Add Journal Error:", err);
      if (err.response?.status === 403) navigate("/signin");
    }
  };

  const deleteJournal = async (id) => {
    try {
      await axios.delete(`${apiBase}/user/journal/${id}`, {
        headers: authHeaders(),
      });
      loadJournals();
    } catch (err) {
      console.log("Delete Journal Error:", err);
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
            placeholder="Write your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 p-3 border rounded-lg"
          />

          <button
            onClick={addJournal}
            className="mt-3 px-5 py-2 rounded-md bg-pink-500 text-white font-bold hover:bg-pink-600"
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
                <p className="text-gray-600 mt-2">{entry.content}</p>
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
