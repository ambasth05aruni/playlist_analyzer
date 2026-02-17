"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

interface PlaylistInputProps {
    onFetch: (url: string) => void;
    isLoading: boolean;
}

export default function PlaylistInput({ onFetch, isLoading }: PlaylistInputProps) {
    const [url, setUrl] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim() && !isLoading) {
            onFetch(url.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                <div className="relative flex items-center bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
                    <Search className="ml-4 w-5 h-5 text-white/40 flex-shrink-0" />
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste a YouTube playlist URL..."
                        className="flex-1 bg-transparent px-4 py-4 text-white placeholder-white/40 focus:outline-none text-base font-mono"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !url.trim()}
                        className="m-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 text-sm"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Fetching...
                            </>
                        ) : (
                            "Analyze"
                        )}
                    </button>
                </div>
            </div>
            <p className="text-center text-white/30 text-sm mt-3 font-mono">
                e.g. https://youtube.com/playlist?list=PLhTm4jreEBz9G2eYFIePmMbyVmeoLeSMF
            </p>
        </form>
    );
}
