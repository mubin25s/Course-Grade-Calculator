# 🎓 Project Documentation: Course Grade Calculator (React Version)

## 🌟 Project Overview
The **Course Grade Calculator** is a modern React web application built with Vite and React Router, designed for university students to track, predict, and calculate their grades. It provides two main tools:

1. **Universal Grade Calculator** — Renders dynamically based on a custom setup of marks distribution weights (Quiz, Presentation, Assignment, Attendance, Mid Term, Final Exam). Components with a weight of 0% are hidden automatically.
2. **Cumulative CGPA Calculator** — Enables credit-weighted GPA calculation, both automatically (by saving grades from the Universal Calculator) and manually (using direct course inputs).

---

## 🛠️ Technology Stack
- **React 18** — Component-driven user interface
- **Vite** — Fast production builder and hot module replacement
- **React Router Dom v6** — Client-side SPA navigation
- **CSS3 (Vanilla)** — Custom premium glassmorphism theme (`index.css`)
- **Font Awesome 6** — Modern icons
- **Service Worker** — Dynamic caching for offline PWA installation

---

## 📂 React Project Architecture

```text
react-app/
├── public/                            # Static assets and PWA files
│   ├── LOGO.png                       # High resolution branding icon
│   ├── manifest.json                  # PWA metadata configuration
│   └── sw.js                          # Dynamic cache service worker
├── src/
│   ├── main.jsx                       # Renders React tree to DOM
│   ├── App.jsx                        # Routing configuration (5 routes)
│   ├── index.css                      # Unified premium design system styles
│   ├── data/
│   │   └── gradingSystems.js          # Predefined grading systems data
│   ├── hooks/
│   │   └── useCalculator.js           # Custom state and grading prediction logic
│   ├── components/                    # Focused layout UI elements
│   │   ├── BackgroundGlobes.jsx       # Animated aesthetic globes
│   │   ├── SetupModal.jsx             # Calculator configuration modal
│   │   ├── SelectionButtons.jsx       # Poor/Good/Excellent score picker
│   │   ├── QuizInputs.jsx             # Dynamic quiz inputs list
│   │   ├── ResultsFooter.jsx          # Live score preview & Add to Semester button
│   │   ├── GradeTargetsTable.jsx      # Target grade threshold visualizer
│   │   ├── SemesterSummary.jsx        # Current session course summary list
│   │   ├── GradingSystemModal.jsx     # Grading systems chooser
│   │   ├── ConfirmModal.jsx           # Action confirmation popups
│   │   └── Toast.jsx                  # Custom alert toast messages
│   └── pages/                         # Core router pages
│       ├── DashboardPage.jsx          # Welcome landing, presets selection
│       ├── CalculatorPage.jsx         # Live grade entry and milestones
│       ├── AboutPage.jsx              # Author info and disclaimer
│       ├── CGPAPage.jsx               # Manual course inputs CGPA tool
│       └── CGPAResultPage.jsx         # Saved semester courses evaluation page
```

---

## ⚙️ Routing & State Management

### Route Paths
| Route | Component | Page Role |
|---|---|---|
| `/` | `DashboardPage` | Main entrance and config modal launcher |
| `/calculator` | `CalculatorPage` | Custom distribution grade entry sheet |
| `/cgpa` | `CGPAPage` | Manual credits/grades aggregator |
| `/cgpa-result` | `CGPAResultPage` | Saved semester results analyzer |
| `/about` | `AboutPage` | Developer and legal information |

### Hook: `useCalculator`
All calculator logic is decoupled from UI elements in `useCalculator.js`:
- Maintains values for quizzes, presentation quality, assignments, attendance percentage, mid-term, and final exam.
- Live-calculates quiz score based on chosen method (Average vs Sum) and quiz counts.
- Dynamically predicts grades using the selected grading system thresholds.
- Evaluates grade milestone requirements ("How many marks are needed in the final to reach B+?").
- Exports grade targeting statistics for tables.

---

## 📌 PWA Service Worker & Caching
The application includes service worker support in `/sw.js`:
- Pre-caches core assets on installation.
- Utilizes **dynamic caching** to store built Vite script bundles (`.js`/`.css`) on-demand.
- Implements an SPA navigation fallback, ensuring offline access to the calculator pages even on deep links.

---

## ⚖️ Legal Disclaimer
This project is an **independent, unofficial student initiative**. It is not affiliated with, endorsed by, or connected to any university. Grading rules are implemented based on publicly available information and are subject to change.
