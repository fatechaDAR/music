"use client";

import { useEffect, useRef, useState } from "react";

type Song = {
  filename: string;
  title: string;
};

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // ambil lagu dari API
  useEffect(() => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => {
        setSongs(data);

        // ambil lagu terakhir dari localStorage
        const lastIndex = localStorage.getItem("lastIndex");
        if (lastIndex) {
          setCurrentIndex(Number(lastIndex));
        }
      });
  }, []);

  // auto play + resume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const lastTime = localStorage.getItem("lastTime");
    if (lastTime) {
      audio.currentTime = Number(lastTime);
    }

    audio.play().catch(() => {});
  }, [currentIndex]);

  // simpan posisi lagu
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    localStorage.setItem("lastTime", audio.currentTime.toString());
    localStorage.setItem("lastIndex", currentIndex.toString());
  };

  // auto next lagu
  const handleEnded = () => {
 if (shuffle) {
    const randomIndex = Math.floor(Math.random() * songs.length);
    setCurrentIndex(randomIndex);
  } else {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
  }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎵 My Music</h1>

      {/* LIST LAGU */}
      {songs.map((song, index) => (
        <div key={song.filename} style={{ marginBottom: "10px" }}>
          <button
            onClick={() => setCurrentIndex(index)}
            style={{
              padding: "10px",
              width: "100%",
              fontSize: "16px",
              background: index === currentIndex ? "#ddd" : "#000000",
            }}
          >
            ▶ {song.title}
          </button>
        </div>
      ))}


          <button
            onClick={() => setShuffle(!shuffle)}
            style={{
              padding: "10px",
              fontSize: "16px",
              marginBottom: "10px",
              background: shuffle ? "#ccc" : "#fff"
            }}
          >
            🔀 Shuffle: {shuffle ? "ON" : "OFF"}
          </button>

      {/* PLAYER */}
      {songs.length > 0 && (
        <audio
          ref={audioRef}
          src={`/api/stream/${encodeURIComponent(
            songs[currentIndex].filename
          )}`}
          controls
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          style={{ width: "100%", marginTop: "20px" }}
        />
      )}
    </div>
  );
}