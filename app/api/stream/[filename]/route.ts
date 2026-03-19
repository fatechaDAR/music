import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {

  const url = new URL(req.url);
  const filename = decodeURIComponent(
    url.pathname.split("/api/stream/")[1]
  );

  const musicDir = path.join(process.cwd(), "music");
  const filePath = path.join(musicDir, filename);

  console.log("filename:", filename);
  console.log("filePath:", filePath);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("File not found: " + filePath, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
}