# 🎓 Project Documentation: Course Grade Calculator

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Problem Statement & Motivation](#-problem-statement--motivation)
3. [Key Features](#-key-features)
4. [Technology Stack](#-technology-stack)
5. [Project Architecture](#-project-architecture)
6. [Core Functionalities](#-core-functionalities)
7. [Design & User Experience](#-design--user-experience)
8. [Technical Implementation Details](#-technical-implementation-details)
9. [Future Roadmap](#-future-roadmap)
10. [Legal Disclaimer](#-legal-disclaimer)

---

## 🌟 Project Overview
The **Course Grade Calculator** is a comprehensive, web-based tool designed specifically for university students in Bangladesh. It simplifies the often complex process of tracking academic performance by providing university-specific grading calculations for both individual courses and overall CGPA.

## 💡 Problem Statement & Motivation
University students frequently struggle with:
- **Complex Grading Systems**: Different universities use different credit weights and grade thresholds.
- **Predictive Needs**: Students often want to know exactly how many marks they need in a final exam to achieve a target grade (e.g., "What do I need for an A?").
- **Manual Errors**: Calculating quiz averages (best 3 out of 5, etc.) and adding up various components manually is prone to mistakes.

This project was created to provide a **centralized, automated, and accurate** platform that handles these calculations instantly.

## ✨ Key Features
- **University-Specific Portals**: Tailored calculation pages for leading Bangladeshi universities.
- **Dynamic Quiz Management**: Add or remove quizzes dynamically; the system automatically calculates the average based on the best 3 scores.
- **Milestone Tracking**: Real-time feedback on "Next Milestone" (how many marks are needed for the next higher grade).
- **Interactive Component Selection**: Quality-based selection for Presentations and Assignments (Poor/Good/Excellent) with automatic mark assignment.
- **Real-time CGPA Calculation**: A dedicated multi-semester CGPA calculator.
- **Visual Feedback**: Color-coded grades and intuitive target achievement tables.

## 🛠️ Technology Stack
- **Frontend**: 
  - **HTML5**: For semantic structure and layout.
  - **CSS3 (Vanilla)**: For premium styling, including glassmorphism effects, responsive layouts, and animations.
  - **JavaScript (ES6+)**: Handles all core logic, DOM manipulation, and real-time calculations.
- **Icons**: [FontAwesome](https://fontawesome.com/) for a modern, intuitive UI.
- **Fonts**: Modern typography for readability and aesthetics.

## 📂 Project Architecture
The project is organized in a modular structure to ensure maintainability and easy addition of new universities.

```text
Course-Grade-Calculator/
├── index.html                  # Root entry point (Redirects to main app)
├── README.md                   # Quick start guide
├── PROJECT_DOCUMENTATION.md    # Detailed project documentation (This file)
├── X_Calculator/               # Modular calculation engines
│   ├── CGPA_Calculator/        # Generic CGPA calculation logic
│   └── Grade_Calculator/       # Core Grade Calculation engine
│       ├── Config.json         # Master list of supported universities
│       └── Calculator.js       # Main logic shared across calculators
└── [University Name]/          # Dedicated folders for each university
    ├── Course.html             # UI specific to the university
    └── Calculator.js           # University-specific logic overrides
```

## ⚙️ Core Functionalities

### 1. Grade Calculation Engine
The system breaks down a course into several components:
- **Quizzes**: Supports up to 10 entries, picking the top 3 for the average.
- **Midterm**: Input for midterm assessment.
- **Attendance**: Calculated as a percentage and converted to points (e.g., out of 7 for certain systems).
- **Presentation & Assignments**: Interaction driven selection based on performance quality.
- **Final Exam**: The "missing piece" used to predict final outcomes.

### 2. Predictive Analytics (Milestones)
While a student is halfway through a semester, the app calculates:
- The **Current Total** mark obtained so far.
- The **Minimum Score** needed in the final exam to reach the next grade level.
- A **Grade Targets Table** showing the status (Achieved, Possible, or Not Possible) for all grade categories.

### 3. CGPA Calculation
Allows students to input credits and SGPA for multiple semesters to compute the Cumulative Grade Point Average accurately.

## 🎨 Design & User Experience
- **Premium Aesthetics**: Uses a modern dark/light theme approach with curated color palettes.
- **Responsive Design**: Fully optimized for mobile devices, ensuring students can check their grades on the go.
- **Micro-interactions**: Subtle hover effects, toast notifications for input validation, and animated state changes.

## 🔍 Technical Implementation Details
- **Dynamic Rendering**: Quiz inputs are rendered programmatically using JavaScript, preserving previously entered values during re-renders.
- **Input Validation**: `enforceMaxValue` and `validateInput` functions ensure that users cannot enter invalid marks (e.g., more than the maximum allocated for a component).
- **Sorting Logic**: Uses JavaScript's `.sort()` and `.slice()` to accurately pick the best quiz scores for calculation.
- **URL Parsing**: The application intelligently detects which university it is serving by parsing the directory structure from the browser's URL path.

## 🚀 Future Roadmap
- [ ] **Data Persistence**: Use `localStorage` to save student marks so they aren't lost on refresh.
- [ ] **PDF Report Export**: Allow students to download their grade breakdown as a professional PDF report.
- [ ] **Custom Grading Schemes**: Allow users to define their own grading rules if their university isn't listed.
- [ ] **Dark Mode Toggle**: A dedicated switch for manual theme selection.

## ⚖️ Legal Disclaimer
This project is an **independent, unofficial student initiative**. It is not affiliated with, endorsed by, or connected to any of the listed universities. Grading rules are implemented based on publicly available information and are subject to change by the respective institutions.
