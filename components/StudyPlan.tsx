"use client";

import { Calendar, Lightbulb, CheckCircle2 } from "lucide-react";

export interface StudyPlanProps {
    totalDays: number;
    schedule: {
        day: number;
        videos: string[];
        duration: string;
    }[];
    tips?: string;
}

export default function StudyPlan({ totalDays, schedule, tips }: StudyPlanProps) {
    return (
        <div className="w-full max-w-2xl mx-auto animate-fade-in">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-2xl blur opacity-50" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-amber-400" />
                            <h3 className="text-white font-semibold">AI Study Plan</h3>
                        </div>
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-semibold">
                            {totalDays} days
                        </span>
                    </div>

                    {/* Schedule */}
                    <div className="p-5 max-h-96 overflow-y-auto space-y-3 custom-scrollbar">
                        {schedule.map((day, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-amber-400 font-semibold text-sm">
                                        Day {day.day}
                                    </span>
                                    <span className="text-white/40 text-xs font-mono">{day.duration}</span>
                                </div>
                                <ul className="space-y-1.5">
                                    {day.videos.map((video, j) => (
                                        <li key={j} className="text-white/70 text-sm flex items-start gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-white/30 mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-1">{video}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Tips */}
                    {tips && (
                        <div className="p-5 border-t border-white/10">
                            <div className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                <p className="text-white/60 text-sm leading-relaxed">{tips}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
