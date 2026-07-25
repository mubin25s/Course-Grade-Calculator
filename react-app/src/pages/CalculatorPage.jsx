import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculator } from '../hooks/useCalculator';
import BackgroundGlobes from '../components/BackgroundGlobes';
import QuizInputs from '../components/QuizInputs';
import SelectionButtons from '../components/SelectionButtons';
import ResultsFooter from '../components/ResultsFooter';
import GradeTargetsTable from '../components/GradeTargetsTable';
import SemesterSummary from '../components/SemesterSummary';
import GradingSystemModal from '../components/GradingSystemModal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

export default function CalculatorPage() {
  const navigate = useNavigate();
  const calc = useCalculator();

  const [courseName, setCourseName] = useState('');
  const [courseCredits, setCourseCredits] = useState('');
  const [semesterResults, setSemesterResults] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [systemModalOpen, setSystemModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Load semester results on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('semesterResults')) || [];
      setSemesterResults(saved);
    } catch {
      setSemesterResults([]);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAddToSemester = () => {
    const name = courseName.trim();
    const credits = parseFloat(courseCredits);

    if (!name || isNaN(credits)) {
      showToast('Please enter Course Name and Credits first!', 'error');
      return;
    }

    const result = {
      name,
      credits,
      grade: calc.currentGrade.grade,
      gp: calc.currentGrade.gp,
      timestamp: new Date().getTime(),
    };

    const nextResults = [...semesterResults, result];
    setSemesterResults(nextResults);
    localStorage.setItem('semesterResults', JSON.stringify(nextResults));
    showToast(`Added ${name} to Semester Results!`, 'success');

    // Reset inputs for next entry
    setCourseName('');
    setCourseCredits('');
  };

  const handleClearSemester = () => {
    setConfirmModalOpen(true);
  };

  const confirmClearSemester = () => {
    setSemesterResults([]);
    localStorage.removeItem('semesterResults');
    showToast('Semester results cleared!', 'success');
    setConfirmModalOpen(false);
  };

  const handleGoToCGPA = () => {
    if (semesterResults.length === 0) {
      showToast('Add at least one subject first!', 'error');
      return;
    }
    navigate('/cgpa-result');
  };

  const getWeightsSummary = () => {
    const dist = calc.config.distribution;
    return `Quiz: ${dist.quiz}% | Mid: ${dist.mid}% | Final: ${dist.final}%`;
  };

  const dist = calc.config.distribution;

  return (
    <div className="universal-calc-page" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <BackgroundGlobes />

      <div className="container">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
        </a>

        <header>
          <h1 className="dashboard-title">Universal Course Calculator</h1>
          <div className="header-inputs">
            <div className="header-input-group">
              <label><i className="fa-solid fa-book"></i> Course Name</label>
              <input
                type="text"
                placeholder="e.g. Mathematics II"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </div>
            <div className="header-input-group">
              <label><i className="fa-solid fa-star"></i> Credits</label>
              <input
                type="number"
                placeholder="3.0"
                step="0.5"
                min="1"
                max="6"
                value={courseCredits}
                onChange={(e) => setCourseCredits(e.target.value)}
              />
            </div>
          </div>
          <p className="dashboard-subtitle" id="configSummary">{getWeightsSummary()}</p>
        </header>

        <main className="calculator-grid">
          {/* Quizzes Section */}
          {dist.quiz > 0 && (
            <section className="card quiz-section">
              <div className="card-header">
                <h2><i className="fa-solid fa-pen-to-square"></i> Quizzes</h2>
                <span className="badge" id="quiz-badge">
                  Best {calc.config.quizSettings.count} of {calc.config.quizSettings.total} ({calc.config.quizSettings.method === 'avg' ? 'Avg' : 'Sum'})
                </span>
              </div>
              <QuizInputs
                total={calc.config.quizSettings.total}
                quizMax={dist.quiz}
                values={calc.quizValues}
                onChange={calc.setQuizValues}
              />
              <div className="result-display" id="quiz-avg-display">
                Obtained: {calc.quizScore.toFixed(2)} / {dist.quiz}
              </div>
            </section>
          )}

          {/* Presentation Section */}
          {dist.presentation > 0 && (
            <section className="card presentation-section">
              <div className="card-header">
                <h2><i className="fa-solid fa-person-chalkboard"></i> Presentation</h2>
                <span className="badge" id="presentation-badge">Max {dist.presentation}</span>
              </div>
              <SelectionButtons
                type="presentation"
                max={dist.presentation}
                selection={calc.selections.presentation}
                onSelect={calc.setSelection}
              />
              <div className="result-display" id="presentation-display-val">
                Points: {calc.selections.presentation.value}
              </div>
            </section>
          )}

          {/* Assignment Section */}
          {dist.assignment > 0 && (
            <section className="card assignment-section">
              <div className="card-header">
                <h2><i className="fa-solid fa-book"></i> Assignment</h2>
                <span className="badge" id="assignment-badge">Max {dist.assignment}</span>
              </div>
              <SelectionButtons
                type="assignment"
                max={dist.assignment}
                selection={calc.selections.assignment}
                onSelect={calc.setSelection}
              />
              <div className="result-display" id="assignment-display-val">
                Points: {calc.selections.assignment.value}
              </div>
            </section>
          )}

          {/* Attendance Section */}
          {dist.attendance > 0 && (
            <section className="card attendance-section">
              <div className="card-header">
                <h2><i className="fa-solid fa-user-check"></i> Attendance</h2>
                <span className="badge" id="attendance-badge">Max {dist.attendance}</span>
              </div>
              <div className="input-group">
                <label>Attendance Percentage (%)</label>
                <input
                  type="number"
                  placeholder="100"
                  min="0"
                  max="100"
                  value={calc.attendancePercent}
                  onChange={(e) => {
                    const val = Math.min(Math.max(parseFloat(e.target.value) || 0, 0), 100);
                    calc.setAttendancePercent(e.target.value === '' ? '' : String(val));
                  }}
                />
              </div>
              <div className="result-display" id="attendance-display">
                Points: {calc.attendMarks.toFixed(2)} / {dist.attendance}
              </div>
            </section>
          )}

          {/* Mid Term Section */}
          {dist.mid > 0 && (
            <section className="card midterm-section">
              <div className="card-header">
                <h2><i className="fa-solid fa-file-lines"></i> Mid Term</h2>
                <span className="badge" id="mid-badge">Max {dist.mid}</span>
              </div>
              <div className="input-group">
                <label>Estimated Marks</label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  max={dist.mid}
                  value={calc.midMarks}
                  onChange={(e) => {
                    const val = Math.min(Math.max(parseFloat(e.target.value) || 0, 0), dist.mid);
                    calc.setMidMarks(e.target.value === '' ? '' : String(val));
                  }}
                />
              </div>
            </section>
          )}

          {/* Final Exam Section */}
          {dist.final > 0 && (
            <section className="card final-section">
              <div className="card-header">
                <h2><i className="fa-solid fa-graduation-cap"></i> Final Exam</h2>
                <span className="badge" id="final-badge">Max {dist.final}</span>
              </div>
              <div className="input-group">
                <label>Obtained Marks</label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  max={dist.final}
                  value={calc.finalMarks}
                  onChange={(e) => {
                    const val = Math.min(Math.max(parseFloat(e.target.value) || 0, 0), dist.final);
                    calc.setFinalMarks(e.target.value === '' ? '' : String(val));
                  }}
                />
              </div>
            </section>
          )}
        </main>

        <ResultsFooter
          total={calc.total}
          currentGrade={calc.currentGrade}
          milestone={calc.getMilestone()}
          getGradeColorClass={calc.getGradeColorClass}
          onAddToSemester={handleAddToSemester}
        />

        <div className="calculator-bottom-grid">
          <GradeTargetsTable
            targets={calc.getGradeTargets()}
            getGradeColorClass={calc.getGradeColorClass}
            onOpenSystem={() => setSystemModalOpen(true)}
          />

          <SemesterSummary
            results={semesterResults}
            getGradeColorClass={calc.getGradeColorClass}
            onClear={handleClearSemester}
            onGoToCGPA={handleGoToCGPA}
          />
        </div>
      </div>

      <GradingSystemModal
        isOpen={systemModalOpen}
        onClose={() => setSystemModalOpen(false)}
        onApply={calc.applySystem}
      />

      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Clear Semester?"
        message="Are you sure you want to clear all saved semester subjects? This cannot be undone."
        onConfirm={confirmClearSemester}
        onCancel={() => setConfirmModalOpen(false)}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onDone={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
