# 🎓 Project Documentation: Course Grade Calculator

## 🌟 Project Overview
The **Course Grade Calculator** is a comprehensive, web-based academic tool designed for university students. It provides two distinct calculation modes:

1. **Universal Calculator** — A fully configurable calculator where users define their own marks distribution (Quiz, Presentation, Assignment, Attendance, Mid Term, Final Exam). Any component left at 0 is automatically hidden from the calculator view.
2. **University-Specific Portals** — Pre-configured calculation pages tailored to the grading rules of specific Bangladeshi universities.

The goal is to eliminate manual grade computation errors and give students real-time, predictive insights into their academic performance.

---

## 💡 Problem Statement & Motivation
University students frequently struggle with:
- **Complex, Varying Grading Systems**: Each university — sometimes each department — has a different breakdown of how course marks are weighted.
- **Predictive Needs**: Students want to know exactly how many marks are needed in the final exam to reach a target grade (e.g., "What do I need for an A?").
- **Manual Errors**: Calculating quiz averages (e.g., best 3 out of 5) and totalling multiple components manually is tedious and error-prone.

This project provides a **centralized, automated, and accurate** platform that handles these calculations instantly.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| Universal Calculator | Custom marks distribution via a setup modal |
| Smart Section Hiding | Sections with 0% weight are not shown in the calculator |
| Dynamic Quiz Config | Set total quizzes, how many count, and Average or Sum method |
| Milestone Tracking | Shows exactly how many marks you need for the next grade |
| Grade Targets Table | Lists all grades with Achieved / Possible / Not Possible status |
| Quality-Based Selection | Presentation & Assignment use Poor / Good / Excellent buttons |
| CGPA Calculator | Multi-semester CGPA with credit weighting |
| Toast Notifications | Contextual error and success messages that appear above all content |

---

## 🛠️ Technology Stack

- **HTML5** — Semantic structure and layout
- **CSS3 (Vanilla)** — Premium styling, glassmorphism, animations, and responsive layouts
- **JavaScript (ES6+)** — All core logic, DOM manipulation, real-time calculations, and `localStorage` for config persistence
- **Font Awesome 6** — Modern iconography
- **Google Fonts (Outfit)** — Clean, modern typography

---

## 📂 Project Architecture

```text
Course-Grade-Calculator/
├── index.html                         # Root redirect entry point
├── README.md                          # Quick start guide
├── PROJECT_DOCUMENTATION.md           # This file
├── Universities/                      # Pre-configured university portals
│   └── [University Name]/
│       ├── Course.html                # University-specific UI
│       └── Calculator.js              # University-specific logic overrides
└── X_Calculator/                      # Core modular calculation engines
    ├── Grade_Calculator/              # Universal Grade Calculator engine
    │   ├── index.html                 # Landing page & Setup Modal (config)
    │   ├── Universal_Calculator.html  # Calculator UI (rendered after setup)
    │   ├── Universal_Calculator.js    # Main calculation and rendering logic
    │   └── Grade.css                  # All styles for both index + calculator
    └── CGPA_Calculator/               # Dedicated CGPA calculation module
```

---

## ⚙️ Core Functionalities

### 1. Setup Modal & Configuration
The user opens the **Calculator Setup** modal, which lets them:
- Assign percentage weights to 6 components: Quiz, Presentation, Assignment, Attendance, Mid Term, Final Exam (must sum to 100)
- Configure the total number of quizzes and how many of the best scores are counted
- Choose **Average** (best N/total) or **Sum** (add up raw scores) as the quiz calculation method
- The configuration is saved to `localStorage` and passed to the calculator page

### 2. Smart Section Visibility
When the calculator page loads, any section whose configured weight is `0` is automatically hidden using `element.style.display = 'none'`. This keeps the UI clean and prevents irrelevant input fields from confusing users.

### 3. Grade Calculation Engine
The system processes each component individually:
- **Quizzes**: Renders N input fields; sorts and picks the best-scored entries; applies either Average or Sum logic against the configured weight
- **Presentation / Assignment**: Three quality buttons (Poor / Good / Excellent) each map to a percentage of the max mark
- **Attendance**: A percentage input that is converted proportionally to the allocated marks
- **Mid Term / Final Exam**: Direct numerical input validated against the max allowed mark
- All values are summed into a **Total Score** and matched against the grade threshold table

### 4. Predictive Milestone Tracking
The calculator continuously computes:
- The student's **current total** from all submitted components
- The **minimum Final Exam score** needed to reach the next grade boundary
- A **Grade Targets Table** showing which grade levels are Achieved, Possible, or Out of Reach

### 5. Two-Page CGPA Flow
After calculating each course grade, students can save it to a semester list using **"Add to Semester"**. The data is persisted in `localStorage` under the key `semesterResults`. When all courses are added, clicking **"Final CGPA"** navigates to a dedicated `CGPA_Result.html` page that:
- Reads all saved courses from `localStorage`
- Displays them in an individual, deletable card list
- Calculates the weighted CGPA on demand with an animated counter
- Shows total credits, total grade points, and an overall letter-grade badge
- Allows clearing individual courses or all courses at once.

---

## 🎨 Design & User Experience

- **Premium Dark Theme**: Black background with a deep wine-red (`#6D001A`) primary palette
- **Glassmorphism**: Frosted glass cards using `backdrop-filter: blur()` for a modern, depth-rich look
- **Animated Elements**: Gear icon spin, glowing borders, toast slide-in animations, and button hover micro-interactions
- **Responsive**: Fully optimized for both desktop and mobile
- **Error Visibility**: Toast notifications use a `z-index` of `11000` to always appear above modals and overlays

---

## 🔍 Technical Implementation Notes

- **Config Persistence**: `localStorage.setItem('calculatorConfig', ...)` saves the setup. The calculator page reads it on load via `JSON.parse(localStorage.getItem('calculatorConfig'))`.
- **Input Validation**: `enforceLimit()` prevents values exceeding the configured maximum for each component.
- **Dynamic Rendering**: Quiz input fields are generated programmatically via `renderQuizzes()` based on the configured total quiz count.
- **Best Score Logic**: Uses `.sort((a, b) => b - a).slice(0, count)` to select the top N quiz scores.
- **Toast Z-Index**: Set to `11000` to ensure visibility above the modal overlay (`z-index: 10000`).

---

## 🚀 Future Roadmap

- [ ] **PDF Report Export** — Download a grade breakdown as a professional PDF
- [ ] **Custom Grading Schemes** — Allow users to define their own grade thresholds (A+, A, B+, etc.)
- [ ] **Dark/Light Mode Toggle** — Manual theme switching
- [ ] **More University Portals** — Expand coverage of Bangladeshi and international universities
- [ ] **Shareable Results** — Generate a link to share a grade breakdown

---

## ⚖️ Legal Disclaimer
This project is an **independent, unofficial student initiative**. It is not affiliated with, endorsed by, or connected to any of the listed universities. Grading rules are implemented based on publicly available information and are subject to change by the respective institutions.
