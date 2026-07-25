# 🎓 Project Documentation: Course Grade Calculator

## 🌟 Project Overview

The **Course Grade Calculator** is a full-stack React web application built with Vite, React Router, and Firebase. It is designed for university students to calculate grades, track CGPA across semesters, and save academic records to the cloud.

🌐 **Live:** [https://course-grade-calculator-25s.web.app](https://course-grade-calculator-25s.web.app)

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 (Vite) |
| Routing | React Router DOM v6 |
| Styling | Vanilla CSS (`index.css`) + inline styles per page |
| Icons | Font Awesome 6 (CDN) |
| Fonts | Google Fonts — Inter |
| Authentication | Firebase Auth (Email, Google, Phone/OTP) |
| Database | Cloud Firestore (NoSQL, per-user subcollections) |
| Hosting | Firebase Hosting (CDN, global) |
| PWA | Service Worker (`sw.js`) with dynamic caching |

---

## 📂 Architecture

```text
react-app/src/
├── main.jsx                    # Entry point — mounts React tree
├── App.jsx                     # Root — AuthProvider → Router → AppLoader → PageTransition → Routes
├── firebase.js                 # Firebase SDK init (auth, db, analytics)
├── index.css                   # Global design tokens, dark theme, glassmorphism
│
├── context/
│   └── AuthContext.jsx         # Global auth state, Firebase calls, Firestore save helper
│
├── components/
│   ├── AppLoader.jsx           # Branded splash screen during Firebase auth resolution
│   ├── PageTransition.jsx      # Fade+slide animation wrapper for all route changes
│   ├── Toast.jsx               # Floating notification toasts (success / error)
│   ├── ConfirmModal.jsx        # Reusable action confirmation dialog
│   ├── SetupModal.jsx          # Calculator configuration modal (marks distribution)
│   ├── GradingSystemModal.jsx  # Grading system chooser dialog
│   ├── SelectionButtons.jsx    # Poor / Good / Excellent picker buttons
│   ├── QuizInputs.jsx          # Dynamic per-quiz mark entry
│   ├── ResultsFooter.jsx       # Live score summary + Add to Semester CTA
│   ├── GradeTargetsTable.jsx   # Grade threshold status table
│   ├── SemesterSummary.jsx     # Current session course list
│   └── BackgroundGlobes.jsx    # Decorative animated background elements
│
├── pages/
│   ├── DashboardPage.jsx       # Home — calculator card entry points
│   ├── AuthPage.jsx            # Auth — sliding panel (Login + Register)
│   ├── ProfilePage.jsx         # User profile — saved CGPA records from Firestore
│   ├── CalculatorPage.jsx      # Grade entry with milestone predictions
│   ├── CGPAPage.jsx            # Manual CGPA calculator (add courses manually)
│   ├── CGPAResultPage.jsx      # Saved semester courses viewer + cloud save
│   └── AboutPage.jsx           # About, tech stack, disclaimer
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
| Method | Provider |
|---|---|
| Gmail (Google) Sign-In | `GoogleAuthProvider` + `signInWithPopup` |
| GitHub Sign-In | `GithubAuthProvider` + `signInWithPopup` |

### Exported API
```js
const {
  user,               // Firebase user object (null if not logged in)
  loading,            // true while Firebase resolves initial auth state
  loginWithGoogle,    // () → { success, error }
  loginWithGithub,    // () → { success, error }
  logout,             // () → signs out
  saveCgpaRecord,     // (userId, record) → saves to Firestore
  processPendingSave, // () → processes sessionStorage pending save after login
} = useAuth();
```

---

## ☁️ Cloud Firestore Database

### Structure
```
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

### Security Rules
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
Each user can only access their own data. All operations require authentication.

---

## 🎬 UI / UX Architecture

### Loading & Transitions
| Component | Purpose |
|---|---|
| `AppLoader` | Branded splash screen (icon, ring spinner, animated bars) shown while Firebase resolves auth state. Prevents black screen on cold start. |
| `PageTransition` | Wraps all routes with a 220ms fade + translateY transition. Eliminates black flash on navigation. |

### Auth Page Sliding Panel
`AuthPage.jsx` uses a **50/50 split full-screen layout**:
- **Left half**: Always contains the login form (dark background)
- **Right half**: Always contains the register form (dark background)  
- **Red panel** (50% wide, `position: absolute`): Physically slides between the two halves
  - `translateX(100%)` → covers right half → login form visible
  - `translateX(0%)` → covers left half → register form visible
  - Transition: `0.78s cubic-bezier(0.76, 0, 0.24, 1)`

---

## ⚙️ Routing

| Path | Page | Auth Required |
|---|---|---|
| `/` | `DashboardPage` | No |
| `/calculator` | `CalculatorPage` | No |
| `/cgpa` | `CGPAPage` | No |
| `/cgpa-result` | `CGPAResultPage` | No (save requires auth) |
| `/auth` | `AuthPage` | No (redirect if logged in) |
| `/profile` | `ProfilePage` | Yes |
| `/about` | `AboutPage` | No |

---

## 🛠️ Scripts

From project root:

| Command | Action |
|---|---|
| `npm run dev` | Start local dev server (proxies to `react-app`) |
| `npm run build` | Build production bundle in `react-app/dist` |
| `npm run deploy` | Build + deploy to Firebase Hosting |

---

## 📌 PWA Service Worker

The app includes PWA support via `/public/sw.js`:
- Pre-caches core assets on install
- Dynamic caching for Vite JS/CSS bundles
- SPA navigation fallback for offline deep links

---

## ⚖️ Legal Disclaimer
This project is an **independent, unofficial student initiative**. It is not affiliated with, endorsed by, or connected to any university. Grading rules are implemented based on publicly available information and are subject to change.
