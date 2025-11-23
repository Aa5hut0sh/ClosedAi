import { useContext } from "react";
import { MusicContext } from "../context/MusicContext";
import { Volume2, VolumeX } from "lucide-react";

export default function MusicControl() {
  const { volume, setVolume, isMuted, toggleMute } = useContext(MusicContext);

  const handleVolume = (v) => {
    const value = parseFloat(v);

    // If slider goes to 0 → audio muted
    if (value === 0) {
      setVolume(0);
    } else {
      setVolume(value);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 bg-white shadow-xl p-4 rounded-full flex items-center gap-4 border border-gray-200">
      
      {/* MUTE BUTTON */}
      <button
        onClick={toggleMute}
        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
      >
        {isMuted || volume === 0 ? (
          <VolumeX size={20} />
        ) : (
          <Volume2 size={20} />
        )}
      </button>

      {/* VOLUME SLIDER */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => handleVolume(e.target.value)}
        className="w-32 accent-pink-500 cursor-pointer"
      />
    </div>
  );
}
