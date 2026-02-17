import { NextRequest, NextResponse } from "next/server";
import { getPlaylistData } from "@/lib/youtube";
import { extractPlaylistId } from "@/lib/utils";

export async function POST(req: NextRequest) {
    try {
        const { playlistUrl } = await req.json();

        if (!playlistUrl) {
            return NextResponse.json(
                { error: "Playlist URL is required" },
                { status: 400 }
            );
        }

        const playlistId = extractPlaylistId(playlistUrl);
        if (!playlistId) {
            return NextResponse.json(
                { error: "Invalid playlist URL or ID" },
                { status: 400 }
            );
        }

        console.log("Fetching playlist:", playlistId);
        const data = await getPlaylistData(playlistId);

        if (!data || data.numberOfVideos === 0) {
            return NextResponse.json(
                { error: "Playlist not found, is empty, or is private" },
                { status: 404 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Playlist fetch error:", error);
        const message =
            error instanceof Error ? error.message : "Failed to fetch playlist data";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

