# 🎓 Course Grade Calculator

A premium, web-based academic tool that allows students to **calculate course grades and CGPA** with a fully customizable marks distribution system — no restrictions on which university you attend.

## ✨ Key Features

- **🔧 Universal Grade Calculator** — Define your own marks distribution (Quiz, Presentation, Assignment, Attendance, Mid Term, Final Exam) and launch a fully custom calculator
- **🏫 University-Specific Portals** — Dedicated, pre-configured calculators for leading Bangladeshi universities
- **📊 Dynamic Quiz Configuration** — Set total quizzes, quizzes to count, and choose between Average or Sum calculation method
- **🎯 Milestone Tracking** — Real-time prediction of how many more marks you need to reach the next grade
- **📈 Grade Targets Table** — View which grades are Achieved, Possible, or Not Possible
- **🏆 CGPA Calculator** — Multi-semester CGPA calculation with credits
- **✨ Smart Visibility** — Sections with 0% weight are automatically hidden from the calculator

## 🔄 How It Works

### Universal Calculator
1. Click **"Configure & Start Calculator"** on the dashboard
2. Set your custom **Marks Distribution** (must total 100)
3. Configure **Quiz Settings** — total quizzes, how many count, and calculation method
4. Click **"Launch Calculator"** — only the components you gave marks to will appear
5. Enter your scores and watch results update in real time

### University-Specific Calculators
1. Select your **University** from the Universities folder
2. Enter your marks for each component
3. Instantly see your predicted grade and milestone targets

## 🔗 Live Demo
👉 [course-grade-calculator-ten.vercel.app](https://course-grade-calculator-ten.vercel.app)

## 📖 Documentation
For a full breakdown of the project architecture, tools, and technical implementation, see the [Detailed Project Documentation](./PROJECT_DOCUMENTATION.md).

## 🛠️ Technologies
HTML5 • CSS3 (Vanilla) • JavaScript (ES6+) • Font Awesome • Google Fonts (Outfit)

## 📁 Project Structure
```
Course-Grade-Calculator/
├── index.html                        # Root redirect entry point
├── README.md                         # This file
├── PROJECT_DOCUMENTATION.md          # Full technical documentation
├── Universities/                     # Pre-configured university portals
│   └── [University Name]/
│       ├── Course.html
│       └── Calculator.js
└── X_Calculator/                     # Core calculation engines
    ├── Grade_Calculator/             # Universal Grade Calculator
    │   ├── index.html                # Dashboard & Setup Modal
    │   ├── Universal_Calculator.html # Main calculator UI
    │   ├── Universal_Calculator.js   # All calculation logic
    │   └── Grade.css                 # Premium styling
    └── CGPA_Calculator/              # CGPA engine
        ├── CGPA.html                 # Original CGPA calculator
        └── CGPA_Result.html          # Final CGPA results page (two-page flow)
```

## 📌 Disclaimer
This is an independent, unofficial student project.
It is not affiliated with or endorsed by any university.
Grading rules are based on publicly available information and may change.
