import { z } from "zod";
import PlaylistSummary from "@/components/PlaylistSummary";
import StudyPlan from "@/components/StudyPlan";
import LearningPath from "@/components/LearningPath";
import PlaylistComparison from "@/components/PlaylistComparison";

export const tamboComponents = [
    {
        name: "PlaylistSummary",
        description:
            "Shows an AI-generated summary of a YouTube playlist with topics, difficulty level, and prerequisites. Use when the user wants to understand what a playlist covers.",
        component: PlaylistSummary,
        propsSchema: z.object({
            summary: z.string().describe("A 2-3 sentence summary of the playlist content"),
            topics: z.array(z.string()).describe("4-8 main topics covered in the playlist"),
            difficulty: z.enum(["beginner", "intermediate", "advanced"]).describe("Difficulty level"),
            prerequisites: z.array(z.string()).optional().describe("Required knowledge before starting"),
        }),
    },
    {
        name: "StudyPlan",
        description:
            "Shows a day-by-day study schedule for completing a playlist. Use when the user wants a watch plan or schedule.",
        component: StudyPlan,
        propsSchema: z.object({
            totalDays: z.number().describe("Total number of study days"),
            schedule: z.array(
                z.object({
                    day: z.number(),
                    videos: z.array(z.string()).describe("Video titles for this day"),
                    duration: z.string().describe("Total study time for this day"),
                })
            ),
            tips: z.string().optional().describe("Study advice for the user"),
        }),
    },
    {
        name: "LearningPath",
        description:
            "Shows a multi-playlist learning roadmap with milestones for achieving a learning goal. Use when the user provides a learning goal like 'I want to learn React'.",
        component: LearningPath,
        propsSchema: z.object({
            goal: z.string().describe("The user's learning goal"),
            totalDuration: z.string().describe("Estimated total time like '~40 hours'"),
            milestones: z.array(
                z.object({
                    name: z.string().describe("Milestone name"),
                    week: z.string().describe("Week range like '1-2'"),
                    playlists: z.array(
                        z.object({
                            title: z.string(),
                            url: z.string(),
                            duration: z.string(),
                            videos: z.number(),
                        })
                    ),
                })
            ),
            tips: z.string().optional().describe("Learning path advice"),
        }),
    },
    {
        name: "PlaylistComparison",
        description:
            "Shows a side-by-side comparison of multiple YouTube playlists with a recommendation. Use when the user wants to compare playlists.",
        component: PlaylistComparison,
        propsSchema: z.object({
            playlists: z.array(
                z.object({
                    title: z.string(),
                    duration: z.string(),
                    videos: z.number(),
                    topics: z.array(z.string()),
                    difficulty: z.string(),
                    strengths: z.array(z.string()),
                    weaknesses: z.array(z.string()),
                })
            ),
            recommendation: z.object({
                best: z.number().describe("0-based index of the best playlist"),
                reason: z.string(),
            }),
            overlapTopics: z.array(z.string()),
            uniqueTopics: z.record(z.string(), z.array(z.string())),
        }),
    },
];
