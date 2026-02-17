import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const { videoTitles, totalDuration, numberOfVideos } = await req.json();

        if (!videoTitles || videoTitles.length === 0) {
            return NextResponse.json(
                { error: "Video titles are required" },
                { status: 400 }
            );
        }

        const hours = Math.round(totalDuration / 3600);
        const prompt = `Analyze this YouTube playlist and provide a structured summary.

Playlist has ${numberOfVideos} videos, total duration: ~${hours} hours.

Video titles:
${videoTitles.map((t: string, i: number) => `${i + 1}. ${t}`).join("\n")}

Return a JSON object with exactly these fields:
{
  "summary": "A concise 2-3 sentence description of what this playlist covers",
  "topics": ["topic1", "topic2", ...], // 4-8 main topics covered
  "difficulty": "beginner" | "intermediate" | "advanced",
  "prerequisites": ["prereq1", ...] // 1-4 prerequisites, or empty array if none
}

Return ONLY the JSON, no markdown blocks or explanation.`;

        const content = await generateWithGemini(prompt);
        const parsed = JSON.parse(content);

        return NextResponse.json(parsed);
    } catch (error) {
        console.error("AI Summary error:", error);
        const message = error instanceof Error ? error.message : "Failed to generate summary";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
