import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";
import { getPlaylistData } from "@/lib/youtube";
import { extractPlaylistId, formatDurationString } from "@/lib/utils";

export async function POST(req: NextRequest) {
    try {
        const { playlistUrls } = await req.json();

        if (!playlistUrls || playlistUrls.length < 2) {
            return NextResponse.json(
                { error: "At least 2 playlist URLs are required" },
                { status: 400 }
            );
        }

        // Fetch data for all playlists in parallel
        const playlistDataPromises = playlistUrls.map(async (url: string) => {
            const id = extractPlaylistId(url);
            if (!id) throw new Error(`Invalid playlist URL: ${url}`);
            return getPlaylistData(id);
        });

        const allPlaylistData = await Promise.all(playlistDataPromises);

        // Build comparison prompt
        const playlistDescriptions = allPlaylistData
            .map(
                (data, i) =>
                    `Playlist ${i + 1}${data.playlistTitle ? ` ("${data.playlistTitle}")` : ""}:
- ${data.numberOfVideos} videos
- Duration: ${formatDurationString(data.totalDuration)}
- Video titles: ${data.videoTitles.slice(0, 20).join(", ")}${data.videoTitles.length > 20 ? "..." : ""}`
            )
            .join("\n\n");

        const prompt = `Compare these YouTube playlists and provide a structured analysis.

${playlistDescriptions}

Return a JSON object with exactly these fields:
{
  "playlists": [
    {
      "title": "Playlist title or inferred name",
      "duration": "Xh Ym",
      "videos": <number>,
      "topics": ["topic1", "topic2"],
      "difficulty": "beginner|intermediate|advanced",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1"]
    }
  ],
  "recommendation": {
    "best": <0-based index of best playlist>,
    "reason": "Why this is the best choice (1-2 sentences)"
  },
  "overlapTopics": ["topics covered by all playlists"],
  "uniqueTopics": { "0": ["unique to first"], "1": ["unique to second"] }
}

Return ONLY the JSON, no markdown blocks.`;

        const content = await generateWithGemini(prompt);
        const parsed = JSON.parse(content);

        return NextResponse.json(parsed);
    } catch (error) {
        console.error("Compare error:", error);
        const message = error instanceof Error ? error.message : "Failed to compare playlists";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
