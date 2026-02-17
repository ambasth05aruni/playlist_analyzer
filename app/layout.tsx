import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Playlist Analyzer — AI-Powered YouTube Playlist Intelligence",
  description:
    "Analyze YouTube playlists with AI. Get duration, study plans, topic summaries, learning paths, and playlist comparisons.",
  keywords: [
    "youtube playlist length",
    "playlist duration",
    "playlist analyzer",
    "AI study planner",
    "playlist at 2x",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-950 text-white min-h-screen`}
      >
        {/* Background effects */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>
        {children}
      </body>
    </html>
  );
}
