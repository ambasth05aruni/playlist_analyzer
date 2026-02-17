import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { goal, timeframe, hoursPerDay } = await req.json();

    if (!goal) {
      return NextResponse.json(
        { error: "Learning goal is required" },
        { status: 400 }
      );
    }

    const tf = timeframe || "4 weeks";
    const hpd = hoursPerDay || 2;

    const prompt = `You are a learning path architect. A user wants to learn something via YouTube playlists.

Goal: "${goal}"
Timeframe: ${tf}
Available time: ${hpd} hours/day

Create a structured learning roadmap with milestones. For each milestone, suggest realistic YouTube playlists that would exist (use real, well-known playlist/course names that exist on YouTube). Estimate realistic durations.

Return a JSON object with exactly these fields:
{
  "goal": "${goal}",
  "totalDuration": "~X hours",
  "milestones": [
    {
      "name": "Milestone Name",
      "week": "1-2",
      "playlists": [
        { "title": "Realistic YouTube Playlist Title", "url": "https://youtube.com/playlist?list=example", "duration": "8h", "videos": 42 }
      ]
    }
  ],
  "tips": "Key advice for this learning path (1-2 sentences)"
}

Include 3-5 milestones with 1-2 playlists each. Return ONLY the JSON, no markdown blocks.`;

    const content = await generateWithGemini(prompt);
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Learning path error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate learning path";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
