# 🚀 DevScore — AI Developer Portfolio Analyzer

<div align="center">

![DevScore Banner](https://img.shields.io/badge/DevScore-GitHub%20Portfolio%20Analyzer-0c8eff?style=for-the-badge&logo=github&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**Analyze any GitHub profile instantly. Get a Developer Score (0–100) with AI-powered insights, strengths, weaknesses, and a personalized improvement plan.**

</div>

---

## 📸 What It Does

Enter a GitHub username → get a full dashboard with:

- 🎯 **Developer Score** (0–100) — animated circular gauge with 5-dimension breakdown
- 👤 **Profile Overview** — avatar, bio, location, social links
- 📊 **Stats Cards** — repos, stars, commits, followers, forks, years active
- 📈 **Charts** — 12-month commit activity bar chart + language distribution pie chart
- 📁 **Top Repositories** — ranked by stars with topics, descriptions, and metadata
- ✅ **Strengths** — auto-detected strong points
- ⚠️ **Weaknesses** — areas needing improvement
- 💡 **Action Plan** — personalized suggestions to grow your profile

---

## 🗂 Project Structure

```
devscore-github-analyzer/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── index.js              # Port, GitHub token, CORS, rate-limit config
│   │   ├── controllers/
│   │   │   └── analyzerController.js # Request validation + HTTP responses (MVC)
│   │   ├── models/
│   │   │   └── AnalysisResult.js     # Data shape + serialization model
│   │   ├── routes/
│   │   │   └── analyzerRoutes.js     # Express route definitions
│   │   ├── services/
│   │   │   ├── githubService.js      # GitHub API calls (paginated)
│   │   │   └── analyzerService.js    # Business logic + data aggregation
│   │   ├── utils/
│   │   │   └── scoring.js            # 5-dimension 0–100 scoring algorithm
│   │   ├── app.js                    # Express app (middleware, CORS, helmet)
│   │   └── server.js                 # Server entry point
│   ├── .env.example                  # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx         # GitHub username input + submit
│   │   │   ├── ScoreCard.jsx         # Animated circular score gauge
│   │   │   ├── StatsOverview.jsx     # 6 metric stat cards
│   │   │   ├── Charts.jsx            # Bar + pie charts (Recharts)
│   │   │   ├── ProfileHeader.jsx     # Avatar, bio, social links
│   │   │   ├── RepoList.jsx          # Top repos ranked by stars
│   │   │   ├── SuggestionsPanel.jsx  # Strengths, weaknesses, action plan
│   │   │   ├── LoadingState.jsx      # Animated loading screen
│   │   │   ├── ErrorState.jsx        # Error display with retry
│   │   │   └── HeroEmpty.jsx         # Landing state before search
│   │   ├── hooks/
│   │   │   └── useAnalyzer.js        # Custom hook for API state management
│   │   ├── pages/
│   │   │   └── Dashboard.jsx         # Main dashboard page
│   │   ├── services/
│   │   │   └── api.js                # Axios API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                 # Tailwind directives + global styles
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│       (Vite proxies /api → localhost:5000 automatically)
│
├── .gitignore
└── README.md
```

---

## ⚙️ Scoring System

Each of the 5 dimensions contributes up to **20 points** (total: **100 points**):

| # | Dimension | Data Source | Max Points |
|---|-----------|-------------|------------|
| 1 | **Repository Count** | Number of original (non-forked) public repos | 20 |
| 2 | **Stars** | Total stargazers across all repositories | 20 |
| 3 | **Activity** | Commits in last 90 days + event type diversity | 20 |
| 4 | **Language Diversity** | Number of unique programming languages used | 20 |
| 5 | **Repo Quality** | Descriptions, topics, forks, wikis, open issues | 20 |

**Score Tiers:**

| Score | Tier | Badge Color |
|-------|------|-------------|
| 0 – 29 | 🔴 Beginner | Rose |
| 30 – 49 | 🟡 Developing | Amber |
| 50 – 69 | 🟢 Proficient | Emerald |
| 70 – 84 | 🔵 Advanced | Cyan |
| 85 – 100 | 🟣 Expert | Violet |

---

## 🛠 Tech Stack

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.18 | HTTP server framework |
| `axios` | ^1.6 | GitHub API HTTP client |
| `cors` | ^2.8 | Cross-origin resource sharing |
| `helmet` | ^7.1 | Security HTTP headers |
| `morgan` | ^1.10 | HTTP request logging |
| `express-rate-limit` | ^7.1 | API rate limiting (50 req / 15 min) |
| `dotenv` | ^16.3 | Environment variable loading |
| `nodemon` | ^3.0 | Dev auto-restart _(devDependency)_ |

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.2 | UI framework |
| `vite` | ^5.0 | Build tool + dev server |
| `tailwindcss` | ^3.4 | Utility-first CSS framework |
| `recharts` | ^2.10 | Bar chart + pie chart |
| `lucide-react` | ^0.383 | Icon library |
| `axios` | ^1.6 | HTTP requests to backend |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed before starting:

```bash
node --version    # Must be v18.0.0 or higher
npm --version     # Must be v9.0.0 or higher
```

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/devscore-github-analyzer.git
cd devscore-github-analyzer
```

---

### Step 2 — Backend Setup

```bash
# Navigate into backend
cd backend

# Install dependencies
npm install

# Create environment file from template
cp .env.example .env
```

Open `.env` in any editor and fill in your values:

```env
PORT=5000
GITHUB_TOKEN=ghp_your_personal_access_token_here
CORS_ORIGIN=http://localhost:5173
```

> ### 🔑 How to Get a GitHub Token (Recommended)
> 1. Go to → **GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)**
>    Or visit: [https://github.com/settings/tokens](https://github.com/settings/tokens)
> 2. Click **"Generate new token (classic)"**
> 3. Name it: `devscore`
> 4. Select scopes: ✅ `public_repo`  ✅ `read:user`
> 5. Click **Generate token** → Copy and paste it into `.env`
>
> | Without token | With token |
> |--------------|------------|
> | 60 requests / hour | 5,000 requests / hour |

---

### Step 3 — Start the Backend

```bash
# Make sure you're inside /backend
npm run dev
```

Expected output:

```
🚀 Portfolio Analyzer API running on http://localhost:5000
📡 GitHub Token: ✅ Configured
🌐 CORS Origin: http://localhost:5173
```

> ✅ Keep this terminal open. Backend runs on **http://localhost:5000**

---

### Step 4 — Frontend Setup

Open a **new terminal window** and run:

```bash
# From project root
cd devscore-github-analyzer/frontend

# Install dependencies
npm install
```

---

### Step 5 — Start the Frontend

```bash
# Make sure you're inside /frontend
npm run dev
```

Expected output:

```
  VITE v5.x.x  ready in ~500ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

> ✅ Frontend runs on **http://localhost:5173**

---

### Step 6 — Open the App

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

Try these GitHub usernames to test:

| Username | Who |
|----------|-----|
| `torvalds` | Linus Torvalds — Linux creator |
| `gaearon` | Dan Abramov — React core team |
| `sindresorhus` | Sindre Sorhus — Open source legend |
| `tj` | TJ Holowaychuk — Express.js creator |
| `your-username` | Analyze yourself! |

---

## ⚡ Quick Command Reference

Copy-paste these to run the full project:

```bash
# ╔══════════════════════════════════════╗
# ║  TERMINAL 1 — Backend               ║
# ╚══════════════════════════════════════╝
cd devscore-github-analyzer/backend
npm install
cp .env.example .env
# → Edit .env and add your GITHUB_TOKEN
npm run dev
# Runs on: http://localhost:5000


# ╔══════════════════════════════════════╗
# ║  TERMINAL 2 — Frontend              ║
# ╚══════════════════════════════════════╝
cd devscore-github-analyzer/frontend
npm install
npm run dev
# Runs on: http://localhost:5173
```

---

## 📡 API Reference

### `GET /api/analyze/:username`

Fetches and analyzes a GitHub user's full profile.

**Example Request:**
```bash
curl http://localhost:5000/api/analyze/gaearon
```

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "login": "gaearon",
      "name": "Dan Abramov",
      "avatar": "https://avatars.githubusercontent.com/u/810438",
      "bio": "Working on @bluesky-social.",
      "location": "London, UK",
      "company": "@bluesky-social",
      "blog": "https://overreacted.io",
      "githubUrl": "https://github.com/gaearon",
      "createdAt": "2011-05-25T18:25:14Z"
    },
    "stats": {
      "totalRepos": 243,
      "originalRepos": 198,
      "forkedRepos": 45,
      "totalStars": 241600,
      "totalForks": 45300,
      "totalWatchers": 241600,
      "commitCountLast90Days": 47,
      "followers": 88200,
      "following": 171,
      "accountAge": 13,
      "languageCount": 12
    },
    "score": {
      "total": 87,
      "breakdown": {
        "repoCount": 19,
        "stars": 20,
        "activity": 16,
        "languageDiversity": 18,
        "repoQuality": 14
      }
    },
    "languages": {
      "JavaScript": 89,
      "TypeScript": 34,
      "HTML": 12,
      "CSS": 8,
      "Python": 4
    },
    "monthlyActivity": [
      { "month": "2025-03", "commits": 12 },
      { "month": "2025-04", "commits": 8 }
    ],
    "topRepos": [
      {
        "name": "redux",
        "description": "Predictable state container for JavaScript apps",
        "stars": 60800,
        "forks": 15200,
        "language": "TypeScript",
        "url": "https://github.com/reduxjs/redux",
        "topics": ["redux", "javascript", "state-management"],
        "updatedAt": "2024-11-01T10:00:00Z",
        "isFork": false
      }
    ],
    "strengths": [
      "High community recognition with significant GitHub stars",
      "Extensive portfolio with a large number of public repositories"
    ],
    "weaknesses": [
      "Low recent commit activity — inconsistent contribution pattern"
    ],
    "suggestions": [
      {
        "category": "Activity",
        "icon": "🔥",
        "text": "Commit consistently. Even small daily contributions maintain your streak."
      }
    ]
  }
}
```

**Error Responses:**

| HTTP Status | Scenario | Error Message |
|-------------|----------|---------------|
| `400` | Invalid username format | `"Invalid GitHub username format"` |
| `404` | User doesn't exist | `"GitHub user \"xyz\" not found"` |
| `429` | GitHub rate limit hit | `"GitHub API rate limit exceeded."` |
| `500` | Server / network error | `"Failed to analyze profile. Please try again."` |

---

### `GET /api/health`

Quick health check to verify the server is running.

```bash
curl http://localhost:5000/api/health
```

```json
{ "status": "ok", "timestamp": "2025-04-22T10:00:00.000Z" }
```

---

## 🏗 MVC Architecture Flow

```
HTTP Request
     │
     ▼
┌─────────────────────────┐
│       Routes            │  analyzerRoutes.js
│  GET /analyze/:username │  Maps URL to controller
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│      Controller         │  analyzerController.js
│  - Validate username    │  Handles req/res only
│  - Call service         │
│  - Return JSON response │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐     ┌──────────────────────────┐
│   Analyzer Service      │────▶│     GitHub Service       │
│  analyzerService.js     │     │    githubService.js      │
│  - Orchestrate data     │     │  - Fetch user profile    │
│  - Aggregate stats      │     │  - Fetch repos (paged)   │
│  - Build insights       │     │  - Fetch events          │
└────────────┬────────────┘     └──────────────────────────┘
             │
             ▼
┌─────────────────────────┐
│        Utils            │  scoring.js
│  - computeScore()       │  Pure scoring functions
│  - detectStrengths()    │  No side effects
│  - detectWeaknesses()   │
│  - generateSuggestions()│
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│        Model            │  AnalysisResult.js
│  - Shape response data  │  Serializes to JSON
│  - toJSON()             │
└─────────────────────────┘
```

---

## 📦 Production Build

```bash
# Step 1 — Build the frontend
cd frontend
npm run build
# Output: frontend/dist/

# Step 2 — Start backend in production mode
cd ../backend
npm start
```

**To serve both from a single server**, add this to `backend/src/app.js`:

```js
const path = require('path');

// Serve built frontend
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Catch-all: send index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});
```

Then visit `http://localhost:5000` — backend serves the frontend too.

---

## 🔧 Environment Variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `PORT` | `5000` | No | Port the backend server listens on |
| `GITHUB_TOKEN` | `""` | Recommended | GitHub Personal Access Token |
| `CORS_ORIGIN` | `http://localhost:5173` | Yes | Frontend URL allowed by CORS |

---

## ⚡ Rate Limits

| Context | Limit |
|---------|-------|
| GitHub API — no token | 60 requests / hour |
| GitHub API — with token | 5,000 requests / hour |
| Backend API (per IP) | 50 requests / 15 minutes |

---

## 🐛 Troubleshooting

**CORS error in browser console**
→ Confirm backend is running on port `5000`. Check that `CORS_ORIGIN` in `.env` exactly matches your frontend URL (including `http://`).

**`403 Forbidden` from GitHub API**
→ You've hit the unauthenticated rate limit (60/hr). Add a `GITHUB_TOKEN` to your `.env` file.

**`404` for a username that exists**
→ Double-check the spelling. Try it directly: `curl http://localhost:5000/api/analyze/<username>`

**Frontend shows blank white page**
→ Run `npm install` inside `/frontend`. Make sure you're running `npm run dev` from inside the `frontend/` directory.

**`nodemon: command not found`**
→ Run `npm install` inside `/backend`. Nodemon is listed as a devDependency and must be installed first.

**Port already in use**
→ Change `PORT=5001` in `.env` and update `vite.config.js` proxy target to match.

---

## 📝 License

MIT © 2025 — Free to use, modify, and distribute.

---

<div align="center">

Built with ❤️ using React, Node.js, Express, and the GitHub API

⭐ **If this project helped you, please give it a star!**

</div>
