"use client";

import { Clock, Video, Gauge } from "lucide-react";
import { formatDurationWithSpeeds, type FormattedDuration } from "@/lib/utils";

interface PlaylistResultsProps {
    totalDuration: number;
    numberOfVideos: number;
    thumbnailUrl: string;
    playlistTitle: string | null;
}

function DurationDisplay({ label, duration, highlight }: { label: string; duration: FormattedDuration; highlight?: boolean }) {
    return (
        <div className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${highlight ? "bg-white/10" : "bg-white/5 hover:bg-white/10"}`}>
            <span className="text-white/60 text-sm font-medium">{label}</span>
            <span className={`font-mono text-sm ${highlight ? "text-white font-bold" : "text-white/80"}`}>
                {duration.hours}h {duration.minutes}m {duration.seconds}s
            </span>
        </div>
    );
}

export default function PlaylistResults({ totalDuration, numberOfVideos, thumbnailUrl, playlistTitle }: PlaylistResultsProps) {
    const speeds = formatDurationWithSpeeds(totalDuration);
    const avgSeconds = totalDuration / numberOfVideos;
    const avgMin = Math.floor(avgSeconds / 60);
    const avgSec = Math.floor(avgSeconds % 60);

    return (
        <div className="w-full max-w-2xl mx-auto animate-fade-in">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-2xl blur opacity-50" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    {/* Header with thumbnail */}
                    <div className="flex items-center gap-4 p-5 border-b border-white/10">
                        {thumbnailUrl && (
                            <img
                                src={thumbnailUrl}
                                alt="Playlist thumbnail"
                                className="w-28 h-20 object-cover rounded-xl shadow-lg"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            {playlistTitle && (
                                <h3 className="text-white font-semibold text-lg truncate">{playlistTitle}</h3>
                            )}
                            <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-1.5 text-white/50 text-sm">
                                    <Video className="w-4 h-4" />
                                    <span>{numberOfVideos} videos</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-white/50 text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>Avg {avgMin}m {avgSec}s</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total duration hero */}
                    <div className="p-5 text-center border-b border-white/10">
                        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Total Duration</p>
                        <p className="text-3xl font-bold text-white font-mono">
                            {speeds.oneX.hours}h {speeds.oneX.minutes}m {speeds.oneX.seconds}s
                        </p>
                    </div>

                    {/* Speed breakdowns */}
                    <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Gauge className="w-4 h-4 text-cyan-400" />
                            <p className="text-white/40 text-xs uppercase tracking-widest">
                                At Different Speeds
                            </p>
                        </div>
                        <div className="space-y-2">
                            <DurationDisplay label="1.00x" duration={speeds.oneX} highlight />
                            <DurationDisplay label="1.25x" duration={speeds.onePointTwoFiveX} />
                            <DurationDisplay label="1.50x" duration={speeds.onePointFiveX} />
                            <DurationDisplay label="1.75x" duration={speeds.onePointSevenFiveX} />
                            <DurationDisplay label="2.00x" duration={speeds.twoX} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
