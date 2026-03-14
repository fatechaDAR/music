import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const musicDir = path.join(process.cwd(), "music");

  const files = fs.readdirSync(musicDir);

  const songs = files
    .filter((file) => file.endsWith(".mp3"))
    .map((file) => {
      const name = file
        .replace(".mp3", "")
        .replace(/-/g, " ");

      return {
        filename: file,
        title: name,
      };
    });

  return NextResponse.json(songs);
}