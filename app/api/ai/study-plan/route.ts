import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const { videoTitles, totalDuration, numberOfVideos, hoursPerDay, daysPerWeek } =
            await req.json();

        if (!videoTitles || videoTitles.length === 0) {
            return NextResponse.json(
                { error: "Video titles are required" },
                { status: 400 }
            );
        }

        const totalHours = Math.round(totalDuration / 3600);
        const hpd = hoursPerDay || 2;
        const dpw = daysPerWeek || 5;

        const prompt = `Create a study plan for a YouTube playlist.

Playlist: ${numberOfVideos} videos, ~${totalHours} hours total.
User's availability: ${hpd} hours/day, ${dpw} days/week.

Video titles (in order):
${videoTitles.map((t: string, i: number) => `${i + 1}. ${t}`).join("\n")}

Group videos into daily study sessions respecting the ${hpd}-hour daily limit. Each day should have a coherent group of related videos.

Return a JSON object with exactly these fields:
{
  "totalDays": <number>,
  "schedule": [
    { "day": 1, "videos": ["Video Title 1", "Video Title 2"], "duration": "1h 45m" },
    { "day": 2, "videos": ["Video Title 3"], "duration": "2h 00m" }
  ],
  "tips": "A helpful study tip for this type of content (1-2 sentences)"
}

Return ONLY the JSON, no markdown blocks or explanation.`;

        const content = await generateWithGemini(prompt);
        const parsed = JSON.parse(content);

        return NextResponse.json(parsed);
    } catch (error) {
        console.error("Study plan error:", error);
        const message = error instanceof Error ? error.message : "Failed to generate study plan";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
