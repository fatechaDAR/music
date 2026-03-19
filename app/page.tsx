"use client";

import { useEffect, useState } from "react";

type Song = {
  filename: string;
  title: string;
};

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎵 My Music</h1>

      {/* LIST LAGU */}
      {songs.map((song) => (
        <div key={song.filename} style={{ marginBottom: "10px" }}>
          <button
            onClick={() => setCurrentSong(song.filename)}
            style={{
              padding: "10px",
              width: "100%",
              fontSize: "16px",
            }}
          >
            ▶ {song.title}
          </button>
        </div>
      ))}

      {/* PLAYER */}
      {currentSong && (
        <div style={{ marginTop: "20px" }}>
          <audio
            controls
            autoPlay
            src={`/api/stream/${encodeURIComponent(currentSong)}`}
            style={{ width: "100%" }}
          />
        </div>
      )}
    </div>
  );
}