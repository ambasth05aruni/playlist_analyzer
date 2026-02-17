"use client";

import { GitCompare, Trophy, Layers, Fingerprint } from "lucide-react";

export interface PlaylistComparisonProps {
    playlists: {
        title: string;
        duration: string;
        videos: number;
        topics: string[];
        difficulty: string;
        strengths: string[];
        weaknesses: string[];
    }[];
    recommendation: {
        best: number;
        reason: string;
    };
    overlapTopics: string[];
    uniqueTopics: Record<string, string[]>;
}

const accentColors = [
    "from-cyan-400 to-blue-500",
    "from-pink-400 to-rose-500",
    "from-amber-400 to-orange-500",
];

export default function PlaylistComparison({
    playlists,
    recommendation,
    overlapTopics,
    uniqueTopics,
}: PlaylistComparisonProps) {
    return (
        <div className="w-full max-w-2xl mx-auto animate-fade-in">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-pink-500/30 rounded-2xl blur opacity-50" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center gap-2 p-5 border-b border-white/10">
                        <GitCompare className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-white font-semibold">Playlist Comparison</h3>
                    </div>

                    {/* Recommendation badge */}
                    <div className="mx-5 mt-5 p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 text-sm font-semibold">Best Pick</span>
                        </div>
                        <p className="text-white/80 text-sm">
                            <span className="font-semibold text-white">{playlists[recommendation.best]?.title}</span>
                            {" — "}{recommendation.reason}
                        </p>
                    </div>

                    {/* Playlist cards */}
                    <div className="p-5 space-y-3">
                        {playlists.map((pl, i) => (
                            <div
                                key={i}
                                className={`bg-white/5 border rounded-xl p-4 ${i === recommendation.best
                                        ? "border-emerald-500/30"
                                        : "border-white/10"
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${accentColors[i % accentColors.length]}`} />
                                            {pl.title}
                                            {i === recommendation.best && (
                                                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                                                    ★ Best
                                                </span>
                                            )}
                                        </h4>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-4 mb-3 text-xs text-white/40">
                                    <span>{pl.duration}</span>
                                    <span>{pl.videos} videos</span>
                                    <span className="capitalize">{pl.difficulty}</span>
                                </div>

                                {/* Strengths */}
                                <div className="mb-2">
                                    <p className="text-xs text-emerald-400/70 mb-1">Strengths</p>
                                    <div className="flex flex-wrap gap-1">
                                        {pl.strengths.map((s, j) => (
                                            <span key={j} className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400/80 rounded-full">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Weaknesses */}
                                {pl.weaknesses.length > 0 && (
                                    <div>
                                        <p className="text-xs text-rose-400/70 mb-1">Weaknesses</p>
                                        <div className="flex flex-wrap gap-1">
                                            {pl.weaknesses.map((w, j) => (
                                                <span key={j} className="text-xs px-2 py-0.5 bg-rose-500/10 text-rose-400/80 rounded-full">
                                                    {w}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Topic analysis */}
                    {overlapTopics.length > 0 && (
                        <div className="px-5 pb-5 space-y-3">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Layers className="w-4 h-4 text-cyan-400" />
                                    <p className="text-white/40 text-xs uppercase tracking-widest">Shared Topics</p>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {overlapTopics.map((t, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400/80 rounded-full text-xs">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {Object.entries(uniqueTopics).map(([idx, topics]) => (
                                topics.length > 0 && (
                                    <div key={idx}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Fingerprint className="w-4 h-4 text-pink-400" />
                                            <p className="text-white/40 text-xs uppercase tracking-widest">
                                                Unique to {playlists[parseInt(idx)]?.title || `Playlist ${parseInt(idx) + 1}`}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {topics.map((t, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-pink-500/10 text-pink-400/80 rounded-full text-xs">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
