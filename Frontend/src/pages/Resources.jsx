import React, { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, Image as ImageIcon } from "lucide-react";
import { Navigation } from "../components/Navigate";
import { ThumbsUp } from "lucide-react";

export const Resources = ({ user, onLogout }) => {
  const [view, setView] = useState("blogs"); // blogs | memes

  // BLOG STATE
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [blogPage, setBlogPage] = useState(1);

  // MEME STATE
  const [memes, setMemes] = useState([]);
  const [loadingMemes, setLoadingMemes] = useState(true);
  const [memeAfter, setMemeAfter] = useState(null);

  const NEWS_API_KEY = "ff10a37211584cc88c5e2342ba6258a7";

  // ---------------------------------------
  // FETCH BLOGS — NEWSAPI
  // ---------------------------------------
  const fetchBlogs = async (more = false) => {
    try {
      if (!more) setLoadingBlogs(true);

      const url = `https://newsapi.org/v2/everything?q="student mental health" OR "college stress" OR "university mental health"&sortBy=publishedAt&pageSize=10&page=${blogPage}&language=en&apiKey=${NEWS_API_KEY}`;

      const res = await axios.get(url);

      const newBlogs = res.data.articles.map((b) => ({
        title: b.title,
        description: b.description || "",
        image: b.urlToImage,
        url: b.url,
        source: b.source.name,
        publishedAt: b.publishedAt,
      }));

      if (more) {
        setBlogs((prev) => [...prev, ...newBlogs]);
      } else {
        setBlogs(newBlogs);
      }
    } catch (err) {
      console.error("NewsAPI error:", err);
    } finally {
      setLoadingBlogs(false);
    }
  };

  // ---------------------------------------
  // FETCH MEMES — REDDIT via Jina Proxy
  // ---------------------------------------
  // In Resources.jsx fetchMemes function
  const fetchMemes = async (more = false) => {
    try {
      if (!more) setLoadingMemes(true);
      const url = `https://meme-api.com/gimme/10`;
      const res = await axios.get(url);
      // the API responds with { count:10, memes:[ ... ] } when count >1
      const memesData = res.data.memes || [res.data];
      const newMemes = memesData.map((m) => ({
        img: m.url,
        title: m.title,
        ups: m.ups,
      }));

      if (more) {
        setMemes((prev) => [...prev, ...newMemes]);
      } else {
        setMemes(newMemes);
      }
    } catch (err) {
      console.error("Meme API error:", err);
    } finally {
      setLoadingMemes(false);
    }
  };

  // ---------------------------------------
  // INITIAL LOAD
  // ---------------------------------------
  useEffect(() => {
    fetchBlogs();
    fetchMemes();
  }, []);

  // ---------------------------------------
  // LOAD MORE HANDLERS
  // ---------------------------------------
  const loadMoreBlogs = () => {
    setBlogPage((prev) => prev + 1);
    fetchBlogs(true);
  };

  const loadMoreMemes = () => {
    fetchMemes(true);
  };

  // ---------------------------------------
  // SKELETONS
  // ---------------------------------------
  const BlogSkeleton = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="p-5 bg-white rounded-xl border shadow animate-pulse"
        >
          <div className="h-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-5 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
        </div>
      ))}
    </div>
  );

  const MemeSkeleton = () => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border shadow p-3 animate-pulse"
        >
          <div className="w-full h-56 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded mt-3"></div>
        </div>
      ))}
    </div>
  );

  // ---------------------------------------
  // MAIN PAGE
  // ---------------------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ------------------- TOGGLE BUTTONS ------------------- */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={() => setView("blogs")}
            className={`px-6 py-3 rounded-full font-semibold shadow transition cursor-pointer ${
              view === "blogs"
                ? "bg-pink-500 text-white"
                : "bg-white border text-gray-600 hover:bg-pink-50"
            }`}
          >
            Blogs
          </button>

          <button
            onClick={() => setView("memes")}
            className={`px-6 py-3 rounded-full font-semibold shadow transition cursor-pointer ${
              view === "memes"
                ? "bg-blue-500 text-white"
                : "bg-white border text-gray-600 hover:bg-blue-50"
            }`}
          >
            Memes
          </button>
        </div>

        {/* ------------------- BLOGS SECTION ------------------- */}
        {view === "blogs" && (
          <>
            <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-900 mb-4">
              <BookOpen className="text-pink-500" />
              Mental Health Blogs
            </h2>

            {loadingBlogs ? (
              <BlogSkeleton />
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {blogs.map((b, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white rounded-xl shadow-md border hover:shadow-xl transition cursor-pointer"
                  >
                    {b.image && (
                      <img
                        src={b.image}
                        alt="blog visual"
                        className="w-full h-40 object-cover rounded mb-3"
                      />
                    )}

                    <h3 className="font-bold text-lg mb-2">{b.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {b.description}
                    </p>
                    <a
                      href={b.url}
                      target="_blank"
                      className="text-pink-600 text-sm font-semibold mt-2 inline-block"
                    >
                      Read more →
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <button
                onClick={loadMoreBlogs}
                className="px-6 py-3 bg-pink-600 text-white rounded-full shadow hover:bg-pink-700 transition"
              >
                Load More Blogs
              </button>
            </div>
          </>
        )}

        {/* ------------------- MEMES SECTION ------------------- */}
        {view === "memes" && (
          <>
            <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-900 mb-4">
              <ImageIcon className="text-blue-500" />
              Memes that will definately make you feel good
            </h2>

            {loadingMemes ? (
              <MemeSkeleton />
            ) : (

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {memes.map((meme, index) => (
    <div
      key={index}
      className="bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition-all flex flex-col"
    >
      <h3 className="font-semibold text-gray-800 mb-3 text-sm">
        {meme.title}
      </h3>

      {/* Image container */}
      <div className="w-full flex-grow flex items-center justify-center rounded-xl overflow-hidden bg-gray-100">
        <img
          src={meme.img}
          alt={meme.title}
          className="max-h-60 object-contain"
        />
      </div>

      {/* Ups at bottom */}
      <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
        <ThumbsUp size={14} /> {meme.ups}
      </p>
    </div>
  ))}
</div>

            )}

            <div className="mt-6 flex justify-center">
              <button
                onClick={loadMoreMemes}
                className="px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
              >
                Load More Memes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
