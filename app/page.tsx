"use client";

import { useState, createElement } from "react";
import PlaylistInput from "@/components/PlaylistInput";
import PlaylistResults from "@/components/PlaylistResults";
import PlaylistSummary from "@/components/PlaylistSummary";
import StudyPlan from "@/components/StudyPlan";
import LearningPath from "@/components/LearningPath";
import PlaylistComparison from "@/components/PlaylistComparison";
import ChatPanel from "@/components/ChatPanel";
import { Sparkles, Github, Clock, Brain, Route, GitCompare } from "lucide-react";

interface PlaylistData {
  totalDuration: number;
  numberOfVideos: number;
  videoTitles: string[];
  thumbnailUrl: string;
  playlistTitle: string | null;
}

interface SummaryData {
  summary: string;
  topics: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  prerequisites: string[];
}

interface StudyPlanData {
  totalDays: number;
  schedule: { day: number; videos: string[]; duration: string }[];
  tips: string;
}

export default function Home() {
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [studyPlanData, setStudyPlanData] = useState<StudyPlanData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isStudyPlanLoading, setIsStudyPlanLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [daysPerWeek, setDaysPerWeek] = useState(5);

  const handleFetch = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setPlaylistData(null);
    setSummaryData(null);
    setStudyPlanData(null);

    try {
      const res = await fetch("/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistUrl: url }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch playlist");
      }

      const data: PlaylistData = await res.json();
      setPlaylistData(data);

      // Auto-fetch AI summary
      fetchSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummary = async (data: PlaylistData) => {
    setIsSummaryLoading(true);
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitles: data.videoTitles,
          totalDuration: data.totalDuration,
          numberOfVideos: data.numberOfVideos,
        }),
      });
      if (res.ok) {
        const summary = await res.json();
        setSummaryData(summary);
      }
    } catch (err) {
      console.error("Summary fetch failed:", err);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const fetchStudyPlan = async () => {
    if (!playlistData) return;
    setIsStudyPlanLoading(true);
    try {
      const res = await fetch("/api/ai/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitles: playlistData.videoTitles,
          totalDuration: playlistData.totalDuration,
          numberOfVideos: playlistData.numberOfVideos,
          hoursPerDay,
          daysPerWeek,
        }),
      });
      if (res.ok) {
        const plan = await res.json();
        setStudyPlanData(plan);
      }
    } catch (err) {
      console.error("Study plan fetch failed:", err);
    } finally {
      setIsStudyPlanLoading(false);
    }
  };

  // Chat message handler
  const handleChatMessage = async (
    message: string
  ): Promise<{ text: string; component?: React.ReactNode }> => {
    const lowerMsg = message.toLowerCase();

    // Learning path requests
    if (
      lowerMsg.includes("learn") ||
      lowerMsg.includes("roadmap") ||
      lowerMsg.includes("path") ||
      lowerMsg.includes("want to")
    ) {
      const res = await fetch("/api/ai/learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: message,
          timeframe: "4 weeks",
          hoursPerDay: 2,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          text: "Here's your personalized learning path:",
          component: createElement(LearningPath, data),
        };
      }
    }

    // Compare requests
    if (lowerMsg.includes("compare") && lowerMsg.includes("playlist")) {
      return {
        text: "To compare playlists, please provide 2-3 playlist URLs separated by spaces or new lines. For example:\n\nhttps://youtube.com/playlist?list=ABC123\nhttps://youtube.com/playlist?list=XYZ789",
      };
    }

    // Summary requests
    if (
      (lowerMsg.includes("summar") || lowerMsg.includes("topic") || lowerMsg.includes("about")) &&
      playlistData
    ) {
      if (summaryData) {
        return {
          text: "Here's the AI analysis of the current playlist:",
          component: createElement(PlaylistSummary, summaryData),
        };
      }
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitles: playlistData.videoTitles,
          totalDuration: playlistData.totalDuration,
          numberOfVideos: playlistData.numberOfVideos,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSummaryData(data);
        return {
          text: "Here's the AI summary:",
          component: createElement(PlaylistSummary, data),
        };
      }
    }

    // Study plan requests
    if (
      (lowerMsg.includes("plan") || lowerMsg.includes("schedule") || lowerMsg.includes("study")) &&
      playlistData
    ) {
      const hoursMatch = lowerMsg.match(/(\d+)\s*hour/);
      const hpd = hoursMatch ? parseInt(hoursMatch[1]) : 2;

      const res = await fetch("/api/ai/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitles: playlistData.videoTitles,
          totalDuration: playlistData.totalDuration,
          numberOfVideos: playlistData.numberOfVideos,
          hoursPerDay: hpd,
          daysPerWeek: 5,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          text: `Here's your study plan for ${hpd} hours/day:`,
          component: createElement(StudyPlan, data),
        };
      }
    }

    // Check if message contains URLs for comparison
    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = message.match(urlPattern);
    if (urls && urls.length >= 2) {
      const res = await fetch("/api/ai/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistUrls: urls }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          text: "Here's the comparison of your playlists:",
          component: createElement(PlaylistComparison, data),
        };
      }
    }

    // Default / no playlist loaded
    if (!playlistData) {
      return {
        text: "Please analyze a playlist first by pasting a URL in the input field above. Then I can help you with summaries, study plans, and more!",
      };
    }

    return {
      text: "I can help you with:\n• \"Summarize this playlist\" — AI topic analysis\n• \"Make a study plan for X hours/day\" — Daily schedule\n• \"I want to learn [topic]\" — Learning path with playlists\n• Paste 2+ playlist URLs — Compare playlists",
    };
  };

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-400" />
            <span className="font-bold text-white">Playlist Analyzer</span>
            <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full ml-1">AI</span>
          </div>
          <a
            href="https://github.com/ambasth05aruni/playlist_analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-12 px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent mb-4 leading-tight">
            Playlist Analyzer
          </h1>
          <p className="text-xl text-white/40 mb-2">for YouTube</p>
          <p className="text-white/50 max-w-lg mx-auto mb-10">
            AI-powered playlist intelligence. Get duration, summaries, study plans, learning paths, and playlist comparisons.
          </p>
          <PlaylistInput onFetch={handleFetch} isLoading={isLoading} />
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="max-w-2xl mx-auto px-6 mb-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Results */}
      {playlistData && (
        <section className="px-6 pb-12 space-y-8 stagger-children">
          {/* Playlist results */}
          <PlaylistResults {...playlistData} />

          {/* AI Summary */}
          <div>
            {isSummaryLoading ? (
              <div className="w-full max-w-2xl mx-auto">
                <div className="glass-card p-8 text-center">
                  <Brain className="w-8 h-8 text-violet-400 mx-auto mb-3 animate-pulse-subtle" />
                  <p className="text-white/50 text-sm">AI is analyzing your playlist...</p>
                </div>
              </div>
            ) : (
              summaryData && <PlaylistSummary {...summaryData} />
            )}
          </div>

          {/* Study Plan Section */}
          <div className="w-full max-w-2xl mx-auto">
            {!studyPlanData && (
              <div className="glass-card p-6 text-center">
                <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Generate Study Plan
                </h3>
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div>
                    <label className="text-white/40 text-xs block mb-1">Hours/day</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(parseInt(e.target.value) || 2)}
                      className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-center text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs block mb-1">Days/week</label>
                    <input
                      type="number"
                      min={1}
                      max={7}
                      value={daysPerWeek}
                      onChange={(e) => setDaysPerWeek(parseInt(e.target.value) || 5)}
                      className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-center text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                </div>
                <button
                  onClick={fetchStudyPlan}
                  disabled={isStudyPlanLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 transition-all text-sm"
                >
                  {isStudyPlanLoading ? "Generating..." : "Generate Plan"}
                </button>
              </div>
            )}
            {studyPlanData && <StudyPlan {...studyPlanData} />}
          </div>
        </section>
      )}

      {/* Feature cards (shown when no playlist is loaded) */}
      {!playlistData && !isLoading && (
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
            <FeatureCard
              icon={<Clock className="w-6 h-6 text-emerald-400" />}
              title="Duration Analysis"
              description="Get total duration with playback speed breakdowns (1x, 1.25x, 1.5x, 1.75x, 2x)"
              gradient="from-emerald-500/10 to-cyan-500/10"
            />
            <FeatureCard
              icon={<Brain className="w-6 h-6 text-violet-400" />}
              title="AI Summary & Topics"
              description="AI extracts topics, difficulty level, and prerequisites from video titles"
              gradient="from-violet-500/10 to-fuchsia-500/10"
            />
            <FeatureCard
              icon={<Route className="w-6 h-6 text-blue-400" />}
              title="Learning Path Agent"
              description='Tell the AI "I want to learn X" and get a multi-playlist roadmap with milestones'
              gradient="from-blue-500/10 to-indigo-500/10"
            />
            <FeatureCard
              icon={<GitCompare className="w-6 h-6 text-pink-400" />}
              title="Playlist Comparison"
              description="Compare 2-3 playlists side by side with AI-powered strengths & weaknesses analysis"
              gradient="from-pink-500/10 to-rose-500/10"
            />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-white/30 text-sm">
          <p>
            Built with ♥ by{" "}
            <a href="https://github.com/ambasth05aruni" target="_blank" className="text-white/50 hover:text-white/70 transition-colors">
              Arunima Ambastha
            </a>
            {"• Powered by AI"}
          </p>
        </div>
      </footer>

      {/* Chat Panel */}
      <ChatPanel onSendMessage={handleChatMessage} />
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className={`glass-card p-6 bg-gradient-to-br ${gradient} hover:scale-[1.02] transition-transform duration-300`}>
      <div className="mb-3">{icon}</div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
