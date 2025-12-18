import { useContext } from "react";
import { MusicContext } from "../context/MusicContext";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export default function MusicControl() {
  const {
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isPlaying,
    togglePlay,
  } = useContext(MusicContext);

  const handleVolume = (v) => {
    const value = parseFloat(v);
    setVolume(value);

    // Auto-unmute if user increases volume
    if (value > 0 && isMuted) {
      toggleMute();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 bg-white shadow-xl p-4 rounded-full flex items-center gap-3 border border-gray-200">

      {/* PLAY / PAUSE */}
      <button
        onClick={togglePlay}
        className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      {/* MUTE */}
      <button
        onClick={toggleMute}
        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
      >
        {isMuted || volume === 0 ? (
          <VolumeX size={18} />
        ) : (
          <Volume2 size={18} />
        )}
      </button>

      {/* VOLUME */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => handleVolume(e.target.value)}
        className="w-24 accent-pink-500 cursor-pointer"
      />
    </div>
  );
}
