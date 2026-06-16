import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

export default function CGPAResultPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState({ cgpa: 0, credits: 0, points: 0, letter: '' });
  const [showResult, setShowResult] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Load courses on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('semesterResults')) || [];
      setCourses(saved);
    } catch {
      setCourses([]);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const saveCourses = (nextCourses) => {
    setCourses(nextCourses);
    localStorage.setItem('semesterResults', JSON.stringify(nextCourses));
  };

  const handleDeleteCourse = (index) => {
    const next = [...courses];
    const removedName = next[index]?.name || 'Course';
    next.splice(index, 1);
    saveCourses(next);
    showToast(`Removed ${removedName} from semester list`, 'success');

    // Re-calculate if result is currently visible
    if (showResult) {
      if (next.length === 0) {
        setShowResult(false);
      } else {
        calculateCGPA(next);
      }
    }
  };

  const handleClearAll = () => {
    if (courses.length === 0) return;
    setConfirmOpen(true);
  };

  const confirmClearAll = () => {
    saveCourses([]);
    setResults({ cgpa: 0, credits: 0, points: 0, letter: '' });
    setShowResult(false);
    showToast('Semester results cleared!', 'success');
    setConfirmOpen(false);
  };

  const calculateCGPA = (coursesList = courses) => {
    if (coursesList.length === 0) return;

    let totalCredits = 0;
    let totalPoints = 0;

    coursesList.forEach(c => {
      totalCredits += c.credits;
      totalPoints += c.gp * c.credits;
    });

    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    // Determine letter grade
    let letter = 'F / Fail';
    if (cgpa >= 3.75) letter = 'A+ / Excellent';
    else if (cgpa >= 3.50) letter = 'A / Very Good';
    else if (cgpa >= 3.25) letter = 'B+ / Good';
    else if (cgpa >= 3.00) letter = 'B / Above Average';
    else if (cgpa >= 2.50) letter = 'C+ / Average';
    else if (cgpa >= 2.00) letter = 'C / Passing';
    else if (cgpa >= 1.00) letter = 'D / Marginal';

    setResults({ cgpa, credits: totalCredits, points: totalPoints, letter });
    setShowResult(true);

    // Smooth scroll to results
    setTimeout(() => {
      const hero = document.getElementById('result-hero');
      if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  return (
    <div style={{ background: '#000000', minHeight: '100vh', color: '#FFFFFF', padding: '2rem 1rem', position: 'relative', overflowX: 'hidden' }}>
      {/* Background orbs */}
      <div className="bg-orb orb-1" style={{ position: 'fixed', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0, width: 500, height: 500, background: 'radial-gradient(circle, rgba(109,0,26,0.2), transparent)', top: -150, left: -150 }}></div>
      <div className="bg-orb orb-2" style={{ position: 'fixed', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0, width: 400, height: 400, background: 'radial-gradient(circle, rgba(109,0,26,0.15), transparent)', bottom: -100, right: -100 }}></div>

      <div className="page-wrapper" style={{ maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <a href="/calculator" onClick={(e) => { e.preventDefault(); navigate('/calculator'); }} className="back-btn">
          <i className="fa-solid fa-arrow-left"></i> Back to Calculator
        </a>

        <div className="page-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="icon-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <img src="/LOGO.png" alt="Logo" style={{ width: 50, height: 50, objectFit: 'contain', display: 'block' }} />
          </div>
          <h1>Final CGPA</h1>
          <p>Review your courses and calculate your cumulative grade point average</p>
        </div>

        {/* CGPA Result Hero */}
        <div className={`result-hero ${showResult ? 'visible' : ''}`} id="result-hero">
          <div className="cgpa-number" id="cgpa-display">{results.cgpa.toFixed(2)}</div>
          <div className="cgpa-label">Cumulative GPA</div>
          <div className="cgpa-stats" style={{ display: 'flex', justifyContent: 'center', gap: '3rem' }}>
            <div className="stat">
              <div className="stat-val" id="total-credits-display">{results.credits.toFixed(1)}</div>
              <div className="stat-lbl">Total Credits</div>
            </div>
            <div className="stat">
              <div className="stat-val" id="total-points-display">{results.points.toFixed(2)}</div>
              <div className="stat-lbl">Total Points</div>
            </div>
            <div className="stat">
              <div className="stat-val" id="total-courses-display">{courses.length}</div>
              <div className="stat-lbl">Courses</div>
            </div>
          </div>
          <div className="grade-badge" id="grade-badge">{results.letter}</div>
        </div>

        {/* Course List */}
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2><i className="fa-solid fa-list-check"></i> &nbsp;Added Courses</h2>
          <span className="count-badge" id="course-count">{courses.length} course{courses.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="course-list" id="course-list">
          {courses.length === 0 ? (
            <div className="empty-state">
              <i className="fa-solid fa-graduation-cap"></i>
              <p>No courses added yet.<br />Go back to the calculator and add courses to your semester.</p>
            </div>
          ) : (
            courses.map((c, i) => (
              <div key={i} className="course-card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="course-name">{c.name}</div>
                <div className="course-credits">{c.credits} CR</div>
                <div className="course-grade">{c.grade} ({c.gp.toFixed(2)})</div>
                <button className="del-btn" onClick={() => handleDeleteCourse(i)} title="Remove">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="actions" style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="btn btn-calculate"
            id="calc-btn"
            onClick={() => calculateCGPA()}
            disabled={courses.length === 0}
          >
            <i className="fa-solid fa-calculator"></i>
            Calculate Final CGPA
          </button>
          <button className="btn btn-clear" onClick={handleClearAll} title="Clear all courses">
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Clear all courses?"
        message="Are you sure you want to clear all courses from your semester history? This cannot be undone."
        onConfirm={confirmClearAll}
        onCancel={() => setConfirmOpen(false)}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onDone={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
