# DevScore — AI Developer Portfolio Analyzer

A full-stack application that analyzes any GitHub profile and generates a comprehensive Developer Score (0–100) with strengths, weaknesses, and an actionable improvement plan.

---

## ✨ Features

- **Developer Score (0–100)** across 5 dimensions — repos, stars, activity, language diversity, quality
- **Profile Overview** — avatar, bio, location, social links
- **Stats Dashboard** — 6 key metrics at a glance
- **Visual Charts** — commit activity (12 months) + language distribution
- **Top Repositories** — ranked by stars with metadata
- **Strengths & Weaknesses** — auto-detected from score breakdown
- **Action Plan** — personalized improvement suggestions
- **Dark-mode SaaS UI** — premium dashboard aesthetic with animations

---

## 🗂 Project Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── config/         # App configuration (port, token, CORS)
│   │   ├── controllers/    # Request/response handlers (MVC controller)
│   │   ├── models/         # Data shape definitions (AnalysisResult)
│   │   ├── routes/         # Express route definitions
│   │   ├── services/       # Business logic (githubService, analyzerService)
│   │   ├── utils/          # Scoring algorithm
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # SearchBar, ScoreCard, Charts, RepoList, etc.
    │   ├── hooks/          # useAnalyzer custom hook
    │   ├── pages/          # Dashboard page
    │   ├── services/       # API client (axios)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Scoring System

Each dimension contributes up to **20 points** (total: 100):

| Dimension          | Source                          | Max |
|--------------------|----------------------------------|-----|
| Repository Count   | Number of original public repos  | 20  |
| Stars              | Total stargazers across repos    | 20  |
| Activity           | Commits in last 90 days + events | 20  |
| Language Diversity | Unique languages used            | 20  |
| Repo Quality       | Descriptions, topics, forks, etc.| 20  |

Score tiers: `Beginner (0–29)` · `Developing (30–49)` · `Proficient (50–69)` · `Advanced (70–84)` · `Expert (85–100)`

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm v9+
- (Optional but recommended) GitHub Personal Access Token

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd portfolio-analyzer
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
GITHUB_TOKEN=ghp_your_token_here    # optional but avoids rate limits
CORS_ORIGIN=http://localhost:5173
```

> **Getting a GitHub Token:**
> GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
> Grant: `public_repo`, `read:user`

Start the backend:
```bash
npm run dev     # development (nodemon)
# or
npm start       # production
```

Backend runs on: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on: `http://localhost:5173`

> The Vite dev server proxies `/api/*` to `http://localhost:5000` automatically.

---

### 4. Open the App

Visit **http://localhost:5173** in your browser.

Enter any GitHub username (e.g., `torvalds`, `gaearon`, `sindresorhus`) and click **Analyze**.

---

## 📡 API Reference

### `GET /api/analyze/:username`

Analyzes a GitHub user's profile.

**Parameters:**
- `username` (path) — GitHub username (1–39 chars, alphanumeric + hyphens)

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "login": "gaearon",
      "name": "Dan Abramov",
      "avatar": "https://avatars.githubusercontent.com/u/810438",
      "bio": "Working on @bluesky-social. ...",
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
      { "month": "2024-05", "commits": 12 },
      { "month": "2024-06", "commits": 8 }
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
```json
{ "success": false, "error": "GitHub user \"xyz\" not found" }           // 404
{ "success": false, "error": "GitHub API rate limit exceeded." }         // 429
{ "success": false, "error": "Invalid GitHub username format" }          // 400
```

### `GET /api/health`
```json
{ "status": "ok", "timestamp": "2024-11-15T12:00:00.000Z" }
```

---

## 🏗 Architecture (MVC)

```
Request → Route → Controller → Service → GitHub API
                      ↓            ↓
                  Response     Scoring Utils
                               (0-100 score)
```

| Layer       | File                          | Responsibility                          |
|-------------|-------------------------------|------------------------------------------|
| Route       | `routes/analyzerRoutes.js`    | URL mapping, HTTP method binding         |
| Controller  | `controllers/analyzerController.js` | Input validation, HTTP responses   |
| Service     | `services/analyzerService.js` | Orchestration, data aggregation          |
| Service     | `services/githubService.js`   | GitHub API calls, pagination             |
| Util        | `utils/scoring.js`            | Score computation, insight generation    |
| Model       | `models/AnalysisResult.js`    | Data shape, serialization                |

---

## 🛠 Tech Stack

### Backend
| Package          | Purpose                          |
|------------------|----------------------------------|
| express          | HTTP framework                   |
| axios            | GitHub API HTTP client           |
| cors             | Cross-origin resource sharing    |
| helmet           | Security headers                 |
| morgan           | HTTP request logging             |
| express-rate-limit | API rate protection            |
| dotenv           | Environment variable management  |

### Frontend
| Package          | Purpose                          |
|------------------|----------------------------------|
| React 18         | UI framework                     |
| Vite 5           | Build tool & dev server          |
| Tailwind CSS 3   | Utility-first styling            |
| Recharts         | Charts (bar + pie)               |
| lucide-react     | Icon library                     |
| axios            | HTTP requests to backend         |

---

## 🔧 Environment Variables

| Variable       | Default                   | Description                         |
|----------------|---------------------------|-------------------------------------|
| `PORT`         | `5000`                    | Backend server port                 |
| `GITHUB_TOKEN` | `""`                      | GitHub PAT (optional, avoids 60/hr limit) |
| `CORS_ORIGIN`  | `http://localhost:5173`   | Frontend origin for CORS            |

---

## 📦 Build for Production

```bash
# Frontend build
cd frontend && npm run build
# Output: frontend/dist/

# Backend — no build step needed (Node.js)
cd backend && npm start
```

To serve frontend from the backend in production, copy `frontend/dist` to `backend/public` and add:
```js
app.use(express.static(path.join(__dirname, '../public')));
```

---

## ⚡ Rate Limits

- **Without GitHub Token:** 60 requests/hour (GitHub unauthenticated)
- **With GitHub Token:** 5,000 requests/hour
- **Backend API:** 50 requests per 15 minutes per IP (configurable)

---

## 📝 License

MIT — free to use, modify, and distribute.
