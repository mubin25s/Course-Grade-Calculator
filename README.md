# 🎓 Course Grade Calculator

A **premium, full-stack React web application** for university students to calculate course grades and CGPA — with Firebase authentication, Firestore cloud storage, PWA support, and a polished, responsive UI.

🌐 **Live App:** [https://course-grade-calculator-25s.web.app](https://course-grade-calculator-25s.web.app)

---

## ✨ Key Features

- **🔧 Universal Grade Calculator** — Define your own marks distribution (Quiz, Presentation, Assignment, Attendance, Mid Term, Final Exam) and launch a custom calculator with single-line course details.
- **📊 Dynamic Quiz Configuration & Sliding Toggle** — Configure total quizzes, quizzes to count, and switch between Average or Sum methods with a smooth animated sliding pill indicator.
- **🎯 Milestone Tracking** — Real-time prediction of how many marks you need to reach the next grade.
- **📈 Grade Targets Table** — View which grades are Achieved, Possible, or Not Possible.
- **🏆 Multi-Semester CGPA Calculator** — Calculate your cumulative GPA using credit-weighted course grades.
- **☁️ Cloud Save** — Save CGPA records to your Firebase profile and access them from any device.
- **🖼️ Profile & Avatar Integration** — Automatically displays your Gmail or GitHub profile picture when signed in.
- **🖼️ Compact No-Scroll Layouts** — Optimized desktop and mobile layouts (`ProfilePage`, `AboutPage`) clamped to fit in one viewport without outer page scrolling.
- **📲 Production PWA** — Service worker (`v12`) using a network-first strategy and cache busting for instant updates when installed on mobile devices.
- **🎬 Smooth Animations** — Branded splash screen, animated route transitions, sliding auth panel, and glowing modal accents.

---



## 📁 Project Structure

```text
Course-Grade-Calculator/
├── README.md                         # Project overview and quick start
├── PROJECT_DOCUMENTATION.md          # Full technical documentation
├── package.json                      # Root scripts (dev, build, deploy)
├── firebase.json                     # Firebase Hosting configuration & Cache-Control headers
├── .firebaserc                       # Firebase project binding
└── react-app/                        # React + Vite web application
    ├── public/
    │   ├── LOGO.png                  # App branding icon
    │   ├── manifest.json             # PWA metadata (standalone, theme color)
    │   └── sw.js                     # Service Worker (Network-First strategy v12)
    └── src/
        ├── main.jsx                  # App entry point + SW registration
        ├── App.jsx                   # Router + AppLoader + PageTransition
        ├── firebase.js               # Firebase SDK initialization
        ├── index.css                 # Global design system & compact responsive rules
        ├── context/
        │   └── AuthContext.jsx       # Global auth state + Firestore save
        ├── components/
        │   ├── AppLoader.jsx         # Branded splash/loading screen
        │   ├── PageTransition.jsx    # Fade+slide route transitions
        │   ├── Toast.jsx             # Notification toasts
        │   ├── ConfirmModal.jsx      # Action confirmation dialogs
        │   ├── SetupModal.jsx        # Calculator setup modal with sliding toggle
        │   └── ...                   # Other reusable UI components
        ├── pages/
        │   ├── DashboardPage.jsx     # Landing page & calculator launcher
        │   ├── AuthPage.jsx          # Login / Register (sliding panel)
        │   ├── ProfilePage.jsx       # User profile, Gmail/GitHub avatar & saved records
        │   ├── CalculatorPage.jsx    # Live grade entry with single-line course header
        │   ├── CGPAPage.jsx          # Manual CGPA calculator
        │   ├── CGPAResultPage.jsx    # Semester results & cloud save
        │   └── AboutPage.jsx         # Redesigned structured About page
        ├── hooks/
        │   └── useCalculator.js      # Calculator state & milestone predictions
        └── data/
            └── gradingSystems.js     # Grading system configurations
```

---

## 🔐 Firebase Services

| Service | Usage |
|---|---|
| **Firebase Auth** | Email/Password, Google Sign-In (Gmail profile photo), GitHub Sign-In |
| **Cloud Firestore** | Stores CGPA records per user under `users/{uid}/records/` |
| **Firebase Hosting** | Serves the production web app globally with `no-cache` headers on index & sw.js |

---

## 📌 Disclaimer
This is an independent, unofficial student project. It is not affiliated with or endorsed by any university. Grading rules are based on publicly available information and subject to change.
