# 🎓 Project Documentation: Course Grade Calculator

## 🌟 Project Overview

The **Course Grade Calculator** is a full-stack React web application built with Vite, React Router v7, and Firebase. It is designed for university students to calculate grades, track CGPA across semesters, and save academic records to the cloud securely.

🌐 **Live App:** [https://course-grade-calculator-25s.web.app](https://course-grade-calculator-25s.web.app)

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 (Vite 8) |
| Routing | React Router DOM v7 |
| Styling | Vanilla CSS (`index.css`) + Inline Page Styles |
| Icons | Font Awesome 6 (CDN) |
| Fonts | Google Fonts — Outfit / Neuhaus |
| Authentication | Firebase Auth (Google / Gmail, GitHub, Email/Password) |
| Database | Cloud Firestore (NoSQL, per-user subcollections) |
| Hosting | Firebase Hosting (CDN with `no-cache` rules for HTML/SW) |
| PWA | Service Worker (`sw.js` v12) with Network-First strategy |

---

## 📂 Architecture

```text
react-app/src/
├── main.jsx                    # Entry point — mounts React tree & registers Service Worker
├── App.jsx                     # Root — AuthProvider → Router → AppLoader → PageTransition → Routes
├── firebase.js                 # Firebase SDK init (auth, db, analytics)
├── index.css                   # Global design system, dark theme, compact scaling rules
│
├── context/
│   └── AuthContext.jsx         # Global auth state, Firebase calls, Firestore save helper
│
├── components/
│   ├── AppLoader.jsx           # Branded splash screen during Firebase auth resolution
│   ├── PageTransition.jsx      # Fade+slide animation wrapper for all route changes
│   ├── Toast.jsx               # Floating notification toasts (success / error)
│   ├── ConfirmModal.jsx        # Reusable action confirmation dialog
│   ├── SetupModal.jsx          # Calculator setup modal with animated sliding pill toggle
│   ├── GradingSystemModal.jsx  # Grading system chooser dialog
│   ├── SelectionButtons.jsx    # Assessment score picker buttons
│   ├── QuizInputs.jsx          # Dynamic per-quiz mark entry
│   ├── ResultsFooter.jsx       # Live score summary + Add to Semester CTA
│   ├── GradeTargetsTable.jsx   # Grade threshold status table
│   ├── SemesterSummary.jsx     # Current session course list
│   └── BackgroundGlobes.jsx    # Decorative animated background elements
│
├── pages/
│   ├── DashboardPage.jsx       # Home — calculator card entry points
│   ├── AuthPage.jsx            # Auth — sliding panel (Login + Register)
│   ├── ProfilePage.jsx         # User profile — Gmail/GitHub avatar & saved CGPA records
│   ├── CalculatorPage.jsx      # Grade entry with single-line course header & milestone predictions
│   ├── CGPAPage.jsx            # Manual CGPA calculator (add courses manually)
│   ├── CGPAResultPage.jsx      # Saved semester courses viewer + cloud save
│   └── AboutPage.jsx           # Redesigned About page (Branding, Features grid, Creator links)
│
├── hooks/
│   └── useCalculator.js        # Calculator state: quiz scoring, grade prediction, milestones
│
└── data/
    └── gradingSystems.js       # Predefined grading system configs (CGPA scales)
```

---

## 🔐 Authentication (`AuthContext.jsx`)

Provides global auth state to the entire app via React Context.

### Supported Methods
| Method | Provider | Feature |
|---|---|---|
| Gmail (Google) Sign-In | `GoogleAuthProvider` + `signInWithPopup` | Imports profile photo (`user.photoURL`) |
| GitHub Sign-In | `GithubAuthProvider` + `signInWithPopup` | Imports profile photo (`user.photoURL`) |
| Email / Password | `signInWithEmailAndPassword` / `createUserWithEmailAndPassword` | Standard auth |

---

## ☁️ Cloud Firestore Database

### Structure
```text
users/
  {userId}/
    records/
      {recordId}/
        cgpa: number
        totalCredits: number
        totalPoints: number
        courses: Array<{ name, credits, gp, grade }>
        calculatorType: string
        timestamp: Timestamp
```

---

## 🎬 UI / UX Architecture & Compact Layouts

### 1. No-Scroll Clamped Pages
- **Profile Page (`ProfilePage.jsx`)**: Clamped to `100dvh` viewport height with `overflow: hidden`. The calculation history list uses internal `overflow-y: auto`, preventing outer page scrollbars. Automatically renders Google/GitHub profile picture from `user.photoURL`.
- **About Page (`AboutPage.jsx`)**: Structured into a single-screen `100dvh` card containing:
  - **App Header**: Logo, title, and `v1.0` badge
  - **Key Capabilities Grid**: 3-column feature cards
  - **Developer Card**: Creator info with circular icon-only social links (LinkedIn, GitHub)
  - **Disclaimer Banner**: Clean dashed notice box

### 2. Universal Calculator Header (`CalculatorPage.jsx`)
- **Single-Line Header Inputs**: **Course Name** and **Credits** input fields are locked onto a single horizontal line (`flex-wrap: nowrap`) across all screen sizes.

### 3. Setup Modal (`SetupModal.jsx`)
- **Sliding Toggle Animation**: Smooth `cubic-bezier(0.4, 0, 0.2, 1)` sliding background pill indicator when toggling between *Average* and *Sum / Total* quiz calculation methods.
- **Red Accent Styling**: Red gear icon (`#C41E3A`) with a soft glow background.

---

## 📌 PWA Service Worker & Firebase Hosting Configuration

### Service Worker (`/public/sw.js` v12)
- **Network-First Strategy**: All navigation/HTML requests check the network first. This ensures fresh JavaScript/CSS bundle hashes emitted by Vite are loaded without 404 errors on PWA launch.
- **Auto Cache Invalidation**: `self.skipWaiting()` and `self.clients.claim()` force installed PWA clients to invalidate old caches and update immediately on deploy.

### Firebase Hosting (`firebase.json`)
```json
{
  "headers": [
    {
      "source": "/sw.js",
      "headers": [{ "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }]
    },
    {
      "source": "/index.html",
      "headers": [{ "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }]
    }
  ]
}
```

---

## 🛠️ Scripts

From project root:

| Command | Action |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Build production bundle in `react-app/dist` |
| `npm run deploy` | Build + deploy to Firebase Hosting |

---

## ⚖️ Legal Disclaimer
This project is an **independent, unofficial student initiative**. It is not affiliated with, endorsed by, or connected to any university. Grading rules are implemented based on publicly available information and are subject to change.
