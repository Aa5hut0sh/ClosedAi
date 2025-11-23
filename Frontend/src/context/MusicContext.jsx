import { createContext, useEffect, useRef, useState } from "react";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const audioRef = useRef(new Audio("/music.mp3"));
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.4);

  // -----------------------------
  // AUTOPLAY AFTER USER INTERACTION
  // -----------------------------
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = volume;

    audio.play().catch(() => {
      console.log("Autoplay blocked. Waiting for interaction...");
    });

    const enableSound = () => {
      if (!isPlaying) {
        audio.play();
        setIsPlaying(true);
      }
      document.removeEventListener("click", enableSound);
      document.removeEventListener("keydown", enableSound);
      document.removeEventListener("scroll", enableSound);
    };

    document.addEventListener("click", enableSound);
    document.addEventListener("keydown", enableSound);
    document.addEventListener("scroll", enableSound);

    return () => {
      document.removeEventListener("click", enableSound);
      document.removeEventListener("keydown", enableSound);
      document.removeEventListener("scroll", enableSound);
    };
  }, []);

  // -----------------------------
  // HANDLE VOLUME CHANGE
  // -----------------------------
  // -----------------------------
// HANDLE VOLUME CHANGE
// -----------------------------
useEffect(() => {
  const audio = audioRef.current;

  if (isMuted) {
    audio.volume = 0;
  } else {
    audio.volume = volume;
  }
}, [volume, isMuted]);

// -----------------------------
// MUTE BUTTON FIXED — INSTANT MUTE
// -----------------------------
const toggleMute = () => {
  if (!isMuted) {
    // Going to mute → remember volume
    setPrevVolume(volume);
    setIsMuted(true);
    setVolume(0);
  } else {
    // Unmute → return to old volume
    setIsMuted(false);
    setVolume(prevVolume || 0.4);
  }
};


  return (
    <MusicContext.Provider
      value={{
        audio: audioRef.current,
        isPlaying,
        setIsPlaying,
        volume,
        setVolume,
        isMuted,
        toggleMute
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
