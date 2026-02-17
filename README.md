# 🎵 PlaylistAnalyzer — AI-Powered YouTube Playlist Intelligence

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?logo=google" alt="Gemini" />
  <img src="https://img.shields.io/badge/YouTube_Data_API-v3-red?logo=youtube" alt="YouTube API" />
</p>

A modern web application that analyzes YouTube playlists and provides **AI-powered insights** using Google Gemini. Get duration breakdowns, smart summaries, personalized study plans, learning path recommendations, and multi-playlist comparisons — all in a sleek, premium dark UI.

---

## ✨ Features

### 📊 Playlist Duration Analysis
- Total playlist duration with playback speed breakdowns (1x, 1.25x, 1.5x, 1.75x, 2x)
- Video count and average video length
- Playlist thumbnail and title

### 🧠 AI-Powered Smart Summary
- Auto-generated playlist description using **Google Gemini 2.5 Flash**
- Topic extraction (4–8 key topics identified)
- Difficulty classification (Beginner / Intermediate / Advanced)
- Prerequisite recommendations

### 📅 Personalized Study Planner
- AI-generated day-by-day watch schedule
- Customizable hours/day and days/week
- Videos grouped into coherent daily sessions
- Smart study tips tailored to content type

### 🗺️ Learning Path Agent
- Enter a learning goal → get a multi-milestone roadmap
- Playlist recommendations for each milestone
- Week-by-week timeline with estimated durations

### ⚖️ Multi-Playlist Comparison
- Side-by-side analysis of 2–3 playlists
- Strengths & weaknesses for each playlist
- Topic overlap visualization
- AI-powered recommendation with reasoning

### 💬 AI Chat Panel
- Floating chat interface for conversational AI interaction
- Powered by Tambo AI for generative UI component rendering

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **AI/LLM** | Google Gemini 2.5 Flash |
| **Data** | YouTube Data API v3 |
| **Chat UI** | Tambo AI (@tambo-ai/react) |
| **Icons** | Lucide React |
| **Validation** | Zod |
| **HTTP** | Axios |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/PlaylistAnalyzer.git
cd PlaylistAnalyzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
YOUTUBE_API_KEY=your_youtube_api_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key  # Optional, for chat panel
```

**How to get API keys:**

| Key | Where to get it | Cost |
|-----|----------------|------|
| `YOUTUBE_API_KEY` | [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Enable "YouTube Data API v3" → Create Credentials | Free (10,000 units/day) |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) → Create API Key | Free tier available |
| `NEXT_PUBLIC_TAMBO_API_KEY` | [Tambo AI](https://tambo.co/) → Dashboard → API Keys | Free tier available |

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
PlaylistAnalyzer/
├── app/
│   ├── layout.tsx                    # Root layout with Inter font & dark theme
│   ├── page.tsx                      # Main page with full state management
│   ├── globals.css                   # Tailwind + custom animations
│   └── api/
│       ├── playlist/route.ts         # YouTube playlist data fetching
│       ├── ai/summary/route.ts       # AI summary & topic extraction
│       ├── ai/study-plan/route.ts    # Personalized study schedule
│       ├── ai/learning-path/route.ts # Multi-milestone learning roadmap
│       └── ai/compare/route.ts       # Side-by-side playlist comparison
├── components/
│   ├── PlaylistInput.tsx             # URL input with gradient border
│   ├── PlaylistResults.tsx           # Duration & speed breakdowns
│   ├── PlaylistSummary.tsx           # AI summary, topics, difficulty
│   ├── StudyPlan.tsx                 # Day-by-day schedule cards
│   ├── LearningPath.tsx              # Milestone timeline
│   ├── PlaylistComparison.tsx        # Comparison table & recommendation
│   └── ChatPanel.tsx                 # Floating AI chat drawer
├── lib/
│   ├── youtube.ts                    # YouTube Data API v3 helpers
│   ├── gemini.ts                     # Google Gemini AI helper with retry logic
│   ├── utils.ts                      # Duration formatting & URL parsing
│   └── tambo-components.ts           # Tambo component registry (Zod schemas)
└── .env.local                        # API keys (not committed)
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│  Next.js App Router + React Components       │
│  (PlaylistInput, Results, Summary, etc.)     │
└──────────────┬──────────────────────────────┘
               │ POST requests
┌──────────────▼──────────────────────────────┐
│              API Routes (Server)             │
│  /api/playlist    → YouTube Data API v3      │
│  /api/ai/summary  → Google Gemini 2.5 Flash  │
│  /api/ai/study-plan → Gemini (structured)    │
│  /api/ai/learning-path → Gemini (agentic)    │
│  /api/ai/compare  → YouTube + Gemini         │
└──────────────┬──────────────┬───────────────┘
               │              │
    ┌──────────▼───┐  ┌───────▼────────┐
    │ YouTube API  │  │  Gemini API    │
    │   (v3)       │  │ (2.5 Flash)    │
    └──────────────┘  └────────────────┘
```

---

## 📸 Screenshots

> Add screenshots of your application here after deploying.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
