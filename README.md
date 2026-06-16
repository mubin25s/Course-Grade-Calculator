# 🎓 Course Grade Calculator (React Version)

A premium, modern React application that allows students to **calculate course grades and CGPA** with a fully customizable marks distribution system.

## ✨ Key Features

- **🔧 Universal Grade Calculator** — Define your own marks distribution (Quiz, Presentation, Assignment, Attendance, Mid Term, Final Exam) and launch a custom calculator.
- **📊 Dynamic Quiz Configuration** — Configure total quizzes, quizzes to count, and choose between Average or Sum calculation methods.
- **🎯 Milestone Tracking** — Real-time prediction of how many more marks you need to reach the next grade.
- **📈 Grade Targets Table** — View which grades are Achieved, Possible, or Not Possible.
- **🏆 Multi-semester CGPA Calculator** — View and calculate your cumulative grade point average using credits.
- **📝 Manual CGPA Calculator** — Manually add individual courses with credits and grade points to compute your CGPA.
- **✨ Smart Visibility** — Sections with 0% weight are automatically hidden from the calculator.

## 🚀 Getting Started

To run the application locally:

1. Navigate to the `react-app` directory:
   ```bash
   cd react-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Build the application for production:
   ```bash
   npm run build
   ```

## 📁 Project Structure

```text
Course-Grade-Calculator/
├── README.md                         # This file
├── PROJECT_DOCUMENTATION.md          # Technical documentation
└── react-app/                        # React + Vite application
    ├── public/                       # Static assets (LOGO, manifest.json, sw.js)
    ├── src/
    │   ├── main.jsx                  # Application entry point
    │   ├── App.jsx                   # Routing and root component
    │   ├── index.css                 # Premium styling & glassmorphism theme
    │   ├── components/               # Reusable calculator & modal components
    │   ├── data/                     # Constants and grading thresholds
    │   ├── hooks/                    # useCalculator state hook
    │   └── pages/                    # Route pages (Dashboard, Calculator, CGPA, Result, About)
    ├── package.json
    └── vite.config.js
```

## 📌 Disclaimer
This is an independent, unofficial student project. It is not affiliated with or endorsed by any university. Grading rules are based on publicly available information and are subject to change.
