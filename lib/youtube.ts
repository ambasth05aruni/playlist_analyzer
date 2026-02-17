import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YT_API_BASE = "https://www.googleapis.com/youtube/v3";

export interface PlaylistData {
    totalDuration: number;
    numberOfVideos: number;
    videoTitles: string[];
    thumbnailUrl: string;
    playlistTitle: string | null;
}

// Parse ISO 8601 duration (PT1H2M3S) into seconds
function parseISO8601Duration(input: string): number {
    const match = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(input);
    if (!match) return 0;
    const days = parseInt(match[1] || "0");
    const hours = parseInt(match[2] || "0");
    const minutes = parseInt(match[3] || "0");
    const seconds = parseInt(match[4] || "0");
    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

// Fetch playlist title
async function getPlaylistTitle(playlistId: string): Promise<string | null> {
    try {
        const { data } = await axios.get(`${YT_API_BASE}/playlists`, {
            params: {
                part: "snippet",
                id: playlistId,
                key: YOUTUBE_API_KEY,
            },
        });
        return data.items?.[0]?.snippet?.title || null;
    } catch {
        return null;
    }
}

// Fetch video IDs from playlist (handles pagination)
async function getAllVideoIds(playlistId: string): Promise<string[]> {
    const videoIds: string[] = [];
    let pageToken: string | undefined;

    do {
        const { data } = await axios.get(`${YT_API_BASE}/playlistItems`, {
            params: {
                part: "contentDetails",
                playlistId,
                maxResults: 50,
                pageToken,
                key: YOUTUBE_API_KEY,
            },
        });

        for (const item of data.items || []) {
            videoIds.push(item.contentDetails.videoId);
        }
        pageToken = data.nextPageToken;
    } while (pageToken);

    return videoIds;
}

// Fetch video details (duration + title) for a batch of IDs
async function getVideoDetails(
    ids: string[]
): Promise<{ duration: number; title: string }[]> {
    const results: { duration: number; title: string }[] = [];

    // YouTube API allows max 50 IDs per request
    for (let i = 0; i < ids.length; i += 50) {
        const batch = ids.slice(i, i + 50);
        const { data } = await axios.get(`${YT_API_BASE}/videos`, {
            params: {
                part: "contentDetails,snippet",
                id: batch.join(","),
                key: YOUTUBE_API_KEY,
            },
        });

        for (const item of data.items || []) {
            results.push({
                duration: parseISO8601Duration(item.contentDetails.duration),
                title: item.snippet.title,
            });
        }
    }

    return results;
}

// Main function: get all playlist data
export async function getPlaylistData(
    playlistId: string
): Promise<PlaylistData> {
    if (!YOUTUBE_API_KEY) {
        throw new Error("YOUTUBE_API_KEY is not configured in .env.local");
    }

    // Get all video IDs from the playlist
    const videoIds = await getAllVideoIds(playlistId);

    if (videoIds.length === 0) {
        throw new Error("Playlist is empty or not found");
    }

    // Get details for all videos
    const details = await getVideoDetails(videoIds);

    let totalDuration = 0;
    const videoTitles: string[] = [];

    for (const video of details) {
        totalDuration += video.duration;
        videoTitles.push(video.title);
    }

    const playlistTitle = await getPlaylistTitle(playlistId);

    return {
        totalDuration,
        numberOfVideos: details.length,
        videoTitles,
        thumbnailUrl: videoIds[0]
            ? `https://img.youtube.com/vi/${videoIds[0]}/mqdefault.jpg`
            : "",
        playlistTitle,
    };
}
