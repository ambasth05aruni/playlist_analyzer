"use client";

import { Route, Clock, Video, Lightbulb, ExternalLink } from "lucide-react";

export interface LearningPathProps {
    goal: string;
    totalDuration: string;
    milestones: {
        name: string;
        week: string;
        playlists: {
            title: string;
            url: string;
            duration: string;
            videos: number;
        }[];
    }[];
    tips?: string;
}

export default function LearningPath({ goal, totalDuration, milestones, tips }: LearningPathProps) {
    return (
        <div className="w-full max-w-2xl mx-auto animate-fade-in">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-2xl blur opacity-50" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="p-5 border-b border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Route className="w-5 h-5 text-blue-400" />
                            <h3 className="text-white font-semibold">Learning Path</h3>
                        </div>
                        <p className="text-white/80 text-lg font-medium">{goal}</p>
                        <p className="text-white/40 text-sm mt-1">Estimated: {totalDuration}</p>
                    </div>

                    {/* Milestones timeline */}
                    <div className="p-5 space-y-0">
                        {milestones.map((milestone, i) => (
                            <div key={i} className="relative pl-8">
                                {/* Timeline line */}
                                {i < milestones.length - 1 && (
                                    <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-blue-500/10" />
                                )}
                                {/* Timeline dot */}
                                <div className="absolute left-0 top-1 w-6 h-6 bg-blue-500/20 border-2 border-blue-400 rounded-full flex items-center justify-center">
                                    <span className="text-blue-400 text-xs font-bold">{i + 1}</span>
                                </div>

                                <div className="pb-6">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-white font-semibold">{milestone.name}</h4>
                                        <span className="text-white/30 text-xs font-mono">Week {milestone.week}</span>
                                    </div>
                                    <div className="space-y-2 mt-3">
                                        {milestone.playlists.map((playlist, j) => (
                                            <a
                                                key={j}
                                                href={playlist.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors group/card"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-white/80 text-sm font-medium">{playlist.title}</p>
                                                    <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover/card:text-blue-400 flex-shrink-0 mt-0.5 transition-colors" />
                                                </div>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="flex items-center gap-1 text-white/40 text-xs">
                                                        <Clock className="w-3 h-3" />
                                                        {playlist.duration}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-white/40 text-xs">
                                                        <Video className="w-3 h-3" />
                                                        {playlist.videos} videos
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tips */}
                    {tips && (
                        <div className="p-5 border-t border-white/10">
                            <div className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                <p className="text-white/60 text-sm leading-relaxed">{tips}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
