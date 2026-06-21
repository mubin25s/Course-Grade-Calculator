# 🎓 Course Grade Calculator

A **premium, full-stack React web application** for university students to calculate course grades and CGPA — with Firebase authentication, Firestore cloud storage, and a polished, animated UI.

🌐 **Live App:** [https://course-grade-calculator-25s.web.app](https://course-grade-calculator-25s.web.app)
📦 **GitHub:** [https://github.com/mubin25s/Course-Grade-Calculator](https://github.com/mubin25s/Course-Grade-Calculator)

---

## ✨ Key Features

- **🔧 Universal Grade Calculator** — Define your own marks distribution (Quiz, Presentation, Assignment, Attendance, Mid Term, Final Exam) and launch a custom calculator.
- **📊 Dynamic Quiz Configuration** — Configure total quizzes, quizzes to count, and choose between Average or Sum calculation methods.
- **🎯 Milestone Tracking** — Real-time prediction of how many marks you need to reach the next grade.
- **📈 Grade Targets Table** — View which grades are Achieved, Possible, or Not Possible.
- **🏆 Multi-semester CGPA Calculator** — Calculate your cumulative GPA using credit-weighted course grades.
- **☁️ Cloud Save** — Save CGPA records to your Firebase profile and access them from any device.
- **🔐 Authentication** — Sign in with Email/Password, Google, or Phone (OTP).
- **🎬 Smooth Transitions** — Branded splash screen, animated page transitions, and sliding auth panel.
- **✨ Smart Visibility** — Sections with 0% weight are automatically hidden from the calculator.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Run Locally

```bash
# From the project root
npm run dev
```

Or from the `react-app` directory:
```bash
cd react-app
npm install
npm run dev
```

### Build & Deploy

```bash
# Build production bundle + deploy to Firebase Hosting
npm run deploy
```

Or separately:
```bash
npm run build      # Build only
npx firebase deploy  # Deploy only
```

---

## 📁 Project Structure

```text
Course-Grade-Calculator/
├── README.md                         # This file
├── PROJECT_DOCUMENTATION.md          # Full technical documentation
├── package.json                      # Root scripts (dev, build, deploy)
├── firebase.json                     # Firebase Hosting configuration
├── .firebaserc                       # Firebase project binding
├── google-services.json              # Android Firebase config
└── react-app/                        # React + Vite web application
    ├── public/
    │   ├── LOGO.png                  # App branding icon
    │   ├── manifest.json             # PWA metadata
    │   └── sw.js                     # Service worker (offline caching)
    └── src/
        ├── main.jsx                  # App entry point
        ├── App.jsx                   # Router + AppLoader + PageTransition
        ├── firebase.js               # Firebase SDK initialization
        ├── index.css                 # Global design system
        ├── context/
        │   └── AuthContext.jsx       # Global auth state + Firestore save
        ├── components/
        │   ├── AppLoader.jsx         # Branded splash/loading screen
        │   ├── PageTransition.jsx    # Fade+slide route transitions
        │   ├── Toast.jsx             # Notification toasts
        │   ├── ConfirmModal.jsx      # Action confirmation dialogs
        │   ├── SetupModal.jsx        # Calculator setup modal
        │   └── ...                   # Other reusable components
        ├── pages/
        │   ├── DashboardPage.jsx     # Home / landing page
        │   ├── AuthPage.jsx          # Login / Register (sliding panel)
        │   ├── ProfilePage.jsx       # User profile & saved records
        │   ├── CalculatorPage.jsx    # Live grade entry
        │   ├── CGPAPage.jsx          # Manual CGPA calculator
        │   ├── CGPAResultPage.jsx    # Semester results & cloud save
        │   └── AboutPage.jsx         # About & disclaimer
        ├── hooks/
        │   └── useCalculator.js      # Calculator state & logic
        └── data/
            └── gradingSystems.js     # Grading system configurations
```

---

## 🔐 Firebase Services

| Service | Usage |
|---|---|
| **Firebase Auth** | Email/Password, Google Sign-In, Phone OTP |
| **Cloud Firestore** | Stores CGPA records per user under `users/{uid}/records/` |
| **Firebase Hosting** | Serves the production web app globally |

---

## 📌 Disclaimer
This is an independent, unofficial student project. It is not affiliated with or endorsed by any university. Grading rules are based on publicly available information and subject to change.
