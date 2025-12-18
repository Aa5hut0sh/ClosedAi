import { createContext, useEffect, useRef, useState } from "react";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const audioRef = useRef(null);
  const hasUserInteracted = useRef(false);

  // -----------------------------
  // LOAD SAVED SETTINGS
  // -----------------------------
  const saved = JSON.parse(localStorage.getItem("musicSettings") || "{}");

  const [isPlaying, setIsPlaying] = useState(saved.isPlaying ?? false);
  const [volume, setVolume] = useState(saved.volume ?? 0.4);
  const [isMuted, setIsMuted] = useState(saved.isMuted ?? false);
  const [prevVolume, setPrevVolume] = useState(saved.prevVolume ?? 0.4);

  // -----------------------------
  // INIT AUDIO (ONCE)
  // -----------------------------
  useEffect(() => {
    audioRef.current = new Audio("/music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, []);

  // -----------------------------
  // USER INTERACTION HANDLER
  // -----------------------------
  useEffect(() => {
    const enableAudio = async () => {
      hasUserInteracted.current = true;

      if (isPlaying && audioRef.current.paused) {
        try {
          await audioRef.current.play();
        } catch (e) {
          console.log("Play blocked, waiting...");
        }
      }

      document.removeEventListener("click", enableAudio);
      document.removeEventListener("keydown", enableAudio);
    };

    document.addEventListener("click", enableAudio);
    document.addEventListener("keydown", enableAudio);

    return () => {
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("keydown", enableAudio);
    };
  }, [isPlaying]);

  // -----------------------------
  // PLAY / PAUSE SYNC
  // -----------------------------
  useEffect(() => {
    if (!audioRef.current) return;

    if (!hasUserInteracted.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // -----------------------------
  // VOLUME / MUTE SYNC
  // -----------------------------
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // -----------------------------
  // SAVE STATE
  // -----------------------------
  useEffect(() => {
    localStorage.setItem(
      "musicSettings",
      JSON.stringify({
        isPlaying,
        volume,
        isMuted,
        prevVolume,
      })
    );
  }, [isPlaying, volume, isMuted, prevVolume]);

  // -----------------------------
  // CONTROLS
  // -----------------------------
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    if (!isMuted) {
      setPrevVolume(volume);
      setIsMuted(true);
      setVolume(0);
    } else {
      setIsMuted(false);
      setVolume(prevVolume || 0.4);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        audio: audioRef.current,
        isPlaying,
        togglePlay,
        volume,
        setVolume,
        isMuted,
        toggleMute,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
