import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { ENABLE_MUSIC, MUSIC_SRC } from "../config/event";
import { CONTENT } from "../config/content";

export default function MusicPlayer() {
  if (!ENABLE_MUSIC) {
    return null;
  }

  return <MusicPlayerInner />;
}

function MusicPlayerInner() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
  }, []);

  if (!isAvailable) {
    return null;
  }

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        loop
        preload="metadata"
        onError={() => setIsAvailable(false)}
      />
      <button
        type="button"
        onClick={togglePlay}
        aria-label={
          isPlaying ? CONTENT.music.pauseLabel : CONTENT.music.playLabel
        }
        aria-pressed={isPlaying}
        className="w-12 h-12 rounded-full bg-white text-[#8A00B8] border border-[#E9E6EC] shadow-md hover:border-[#8A00B8] flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A00B8] cursor-pointer"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Play className="w-5 h-5 translate-x-0.5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
