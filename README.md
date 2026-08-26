# LeetTrack — Student LeetCode Progress Tracker

> **Track. Solve. Improve.**

**LeetTrack** is a modern, developer-centric, full-stack web application designed for colleges and universities to track student LeetCode progress automatically through their **GitHub repositories**.

When students solve LeetCode problems and **LeetSync** automatically pushes accepted solutions to their GitHub repositories, LeetTrack inspects the repository file tree, detects solved problems, categorizes their difficulty (Easy, Medium, Hard), eliminates duplicates across languages, and aggregates class-wide analytics and leaderboards.

---

## 🌟 Key Features

* **LeetSync-Driven Problem Detection Engine**: Automatically detects accepted LeetCode solutions from various repository structures (`Easy/`, `Medium/`, `Hard/`, `0001-two-sum/`, root files like `1. Two Sum.java`).
* **Multi-Language Deduplication**: Solved problems with solutions in multiple languages (e.g. Python and Java) are counted as **1 unique solved problem**.
* **Live GitHub URL Validation**: Real-time validation of student GitHub repositories with status badges (`✓ Valid GitHub Repository` vs `Invalid repository`).
* **Deterministic Leaderboard Tie-Breaker**:
  1. Higher Total Solved
  2. Higher Hard Count
  3. Higher Medium Count
  4. Higher Easy Count
  5. Alphabetical by Name
* **Student Profiles & Analytics**: Shareable profiles (`/student/ECE001`), goal progress bars, difficulty donut charts, and searchable solved problem tables with direct GitHub code links.
* **Class & Department Benchmarks**: Department comparisons, average solves per student, difficulty compositions, and top solver histograms using Recharts.
* **Admin Portal with Route Protection**: Firebase Auth protected `/admin/*` routes to Add, Edit, Delete, and Sync students.
* **Auto Sync & Manual Sync**: Background automated sync interval plus on-demand "Sync All" and "Sync Student" actions.
* **CSV Export**: One-click download of the student roster, leaderboard rankings, and student problem tables.
* **Out-of-the-Box Zero-Config Mode**: Includes realistic sample student data and local persistence so the app can be run and demoed immediately even before configuring Firebase keys.

---

## 🏗️ Architecture & Data Flow

```
LeetCode Solved ──> LeetSync ──> Student GitHub Repo
                                      │
                                GitHub REST API
                                      │
                         githubService & leetcodeParser
                                      │
                              Firestore Database
                                      │
                        React + Tailwind UI (Vite)
                     ┌────────────────┴────────────────┐
             Student/Public UI                    Admin Dashboard
            - Public Dashboard                   - Admin Stats & Analytics
            - Student Search & Directory         - Add / Edit / Delete Student
            - Interactive Profiles               - Live GitHub URL Validator
            - Leaderboards (with tie-breaker)    - Manual & Auto Sync System
            - Class Analytics                    - Settings & Global Goals
```

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite 6, Tailwind CSS 3, Lucide React Icons
* **Charts & Visualizations**: Recharts
* **Backend / Database**: Firebase Authentication, Cloud Firestore
* **External APIs**: GitHub REST API v3
* **Deploy-Ready**: Vercel

---

## 🚀 Getting Started Locally

### 1. Prerequisites
* Node.js 18+ and npm installed on your machine.

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/VASU-G-T/student-leetcode-tracker.git
cd student-leetcode-tracker
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=AIzaSyBfVAGLg6BkREo58FJ69nGC9UFt9YFcvqc
VITE_FIREBASE_AUTH_DOMAIN=leetcode-tracker-18688.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=leetcode-tracker-18688
VITE_FIREBASE_STORAGE_BUCKET=leetcode-tracker-18688.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=331037170948
VITE_FIREBASE_APP_ID=1:331037170948:web:2223193d8346d35648c451
VITE_FIREBASE_MEASUREMENT_ID=G-7YFBNFM1GB

# Optional GitHub Token (increases rate limit from 60 to 5,000 requests/hr)
VITE_GITHUB_TOKEN=

# Default settings
VITE_APP_NAME="LeetTrack"
VITE_DEFAULT_GOAL=200
VITE_AUTO_SYNC_INTERVAL_MINUTES=15
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🔐 Admin Authentication

1. Navigate to `/login` or click **Admin Login** in the navbar.
2. If Firebase Auth is configured, enter your registered admin credentials.
3. For local evaluation, click the **"Fill Demo Credentials"** button (`admin@college.edu` / `admin123`).
4. Once authenticated, you will be redirected to `/admin/dashboard`.

---

## 📂 LeetSync Repository Parsing Details

The `leetcodeParser` inspects repository trees recursively and extracts:
- **Problem Number**: Identifies patterns like `0001-two-sum/`, `1. Two Sum.java`, `0121-best-time...`
- **Problem Title**: Formats clean titles (e.g. "Two Sum", "Palindrome Number")
- **Difficulty**: Detects difficulty folders (`Easy/`, `Medium/`, `Hard/`, `01-easy/`, etc.) or matches against standard LeetCode difficulty maps.
- **Language**: Maps file extensions (`.java` → Java, `.py` → Python, `.cpp` → C++, `.js` → JavaScript, `.ts` → TypeScript, `.go` → Go, `.rs` → Rust, etc.).
- **Ignores**: Non-problem files such as `README.md`, `LICENSE`, `.gitignore`, `.github/` workflows, configuration files, and images.

---

## 🔒 Firestore Security Rules

Deploy the included `firestore.rules` file:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null;
    }

    match /students/{studentId} {
      allow read: if true;
      allow write: if isAdmin();
      
      match /problems/{problemId} {
        allow read: if true;
        allow write: if isAdmin();
      }
    }

    match /activity/{activityId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /settings/{settingId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com/) and click **New Project**.
3. Select your `student-leetcode-tracker` repository.
4. Framework preset: **Vite**.
5. Add your Environment Variables in the Vercel project settings (`VITE_FIREBASE_API_KEY`, etc.).
6. Click **Deploy**.

---

## 📄 License
MIT License. Built for collegiate competitive programming and DSA progress tracking.
