"use client";

import { Brain, Tag, BarChart3, BookOpen } from "lucide-react";

export interface PlaylistSummaryProps {
    summary: string;
    topics: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
    prerequisites?: string[];
}

const difficultyConfig = {
    beginner: { color: "from-green-400 to-emerald-500", bg: "bg-green-500/20", text: "text-green-400" },
    intermediate: { color: "from-yellow-400 to-orange-500", bg: "bg-yellow-500/20", text: "text-yellow-400" },
    advanced: { color: "from-red-400 to-rose-500", bg: "bg-red-500/20", text: "text-red-400" },
};

export default function PlaylistSummary({ summary, topics, difficulty, prerequisites }: PlaylistSummaryProps) {
    const config = difficultyConfig[difficulty] || difficultyConfig.beginner;

    return (
        <div className="w-full max-w-2xl mx-auto animate-fade-in">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 rounded-2xl blur opacity-50" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-violet-400" />
                            <h3 className="text-white font-semibold">AI Summary</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${config.bg} ${config.text}`}>
                            {difficulty}
                        </span>
                    </div>

                    {/* Summary */}
                    <div className="p-5 border-b border-white/10">
                        <p className="text-white/80 leading-relaxed">{summary}</p>
                    </div>

                    {/* Topics */}
                    <div className="p-5 border-b border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-4 h-4 text-fuchsia-400" />
                            <p className="text-white/40 text-xs uppercase tracking-widest">Topics Covered</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {topics.map((topic, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-full text-sm text-white/80 hover:bg-white/15 transition-colors"
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty meter */}
                    <div className="p-5 border-b border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                            <BarChart3 className="w-4 h-4 text-violet-400" />
                            <p className="text-white/40 text-xs uppercase tracking-widest">Difficulty Level</p>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${config.color} rounded-full transition-all duration-700`}
                                style={{ width: difficulty === "beginner" ? "33%" : difficulty === "intermediate" ? "66%" : "100%" }}
                            />
                        </div>
                    </div>

                    {/* Prerequisites */}
                    {prerequisites && prerequisites.length > 0 && (
                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <BookOpen className="w-4 h-4 text-fuchsia-400" />
                                <p className="text-white/40 text-xs uppercase tracking-widest">Prerequisites</p>
                            </div>
                            <ul className="space-y-1.5">
                                {prerequisites.map((prereq, i) => (
                                    <li key={i} className="text-white/70 text-sm flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full flex-shrink-0" />
                                        {prereq}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
