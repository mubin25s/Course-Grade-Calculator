import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import ConfirmModal from '../components/ConfirmModal';
import SaveSemesterModal from '../components/SaveSemesterModal';
import Toast from '../components/Toast';
import BackgroundGlobes from '../components/BackgroundGlobes';

export default function CGPAResultPage() {
  const navigate = useNavigate();
  const { user, saveCgpaRecord } = useAuth();
  const [courses, setCourses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('semesterResults')) || [];
    } catch {
      return [];
    }
  });
  const [results, setResults] = useState({ cgpa: 0, credits: 0, points: 0, letter: '' });
  const [showResult, setShowResult] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [saveLoading, setSaveLoading] = useState(false);
  const [savedToDb, setSavedToDb] = useState(false);
  const [savePromptOpen, setSavePromptOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

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
    setSavedToDb(false);

    setTimeout(() => {
      const hero = document.getElementById('result-hero');
      if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const handleSaveRecord = () => {
    if (courses.length === 0) return;
    setSaveModalOpen(true);
  };

  const handlePerformSave = async (semesterName) => {
    if (courses.length === 0) return;

    const record = {
      semesterName,
      cgpa: results.cgpa,
      credits: results.credits,
      points: results.points,
      courses: courses.map(c => ({
        name: c.name,
        credits: c.credits,
        gp: c.gp,
        grade: c.grade
      })),
      calculatorType: 'universal'
    };

    if (!user) {
      sessionStorage.setItem('pendingSaveCGPA', JSON.stringify(record));
      showToast('Redirecting to login to save your record...', 'warning');
      setTimeout(() => { navigate('/auth?redirect=save-pending'); }, 1200);
      return;
    }

    setSaveLoading(true);
    try {
      const res = await saveCgpaRecord(user.uid, record);
      if (res.success) {
        setSavedToDb(true);
        setSaveModalOpen(false);
        localStorage.removeItem('semesterResults');
        setCourses([]);
        showToast('CGPA record successfully saved to your profile!', 'success');
        if (pendingAction) {
          navigate(pendingAction);
        }
      } else {
        showToast('Failed to save record.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred while saving.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleBackClick = (targetPath) => {
    if (showResult && !savedToDb) {
      setPendingAction(targetPath);
      setSavePromptOpen(true);
    } else {
      navigate(targetPath);
    }
  };

  const getGradeColorClass = (grade) => {
    const map = {
      'A+': 'grade-a-plus', 'A': 'grade-a', 'A-': 'grade-a-minus',
      'B+': 'grade-b-plus', 'B': 'grade-b', 'B-': 'grade-b-minus',
      'C+': 'grade-c-plus', 'C': 'grade-c', 'D': 'grade-d', 'F': 'grade-f',
    };
    return map[grade] || '';
  };

  return (
    <div className="universal-calc-page" style={{ minHeight: '100vh', padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(0.75rem, 3vw, 1.25rem)' }}>
      <BackgroundGlobes />

      <div className="container" style={{ maxWidth: 'min(760px, 100%)', display: 'flex', flexDirection: 'column' }}>

        <a
          href="/calculator"
          onClick={(e) => { e.preventDefault(); handleBackClick('/calculator'); }}
          className="back-link"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Calculator
        </a>

        <header style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
          <div className="header-icon" style={{ marginBottom: '1.25rem' }}>
            <img
              src="/LOGO.png"
              alt="Logo"
              style={{ width: 'clamp(50px, 12vw, 72px)', height: 'clamp(50px, 12vw, 72px)', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 6vw, 3rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
            Final CGPA
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', lineHeight: 1.5 }}>
            Review your courses and calculate your cumulative grade point average
          </p>
        </header>

        {showResult && (
          <div
            id="result-hero"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              borderRadius: '24px',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              textAlign: 'center',
              marginBottom: '1.5rem',
              boxShadow: '0 20px 50px rgba(196,30,58,0.25)',
              animation: 'fadeIn 0.5s ease',
              color: '#fff',
            }}
          >
            <div style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: 900, lineHeight: 1, letterSpacing: '-2px', marginBottom: '0.25rem' }}>
              {results.cgpa.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.75, marginBottom: '1.5rem' }}>
              Cumulative GPA
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(1.5rem, 5vw, 3rem)', marginBottom: '1.25rem' }}>
              {[
                { val: results.credits.toFixed(1), lbl: 'Total Credits' },
                { val: results.points.toFixed(2), lbl: 'Total Points' },
                { val: courses.length, lbl: 'Courses' },
              ].map(({ val, lbl }) => (
                <div key={lbl}>
                  <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.75rem)', fontWeight: 800 }}>{val}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '1px' }}>{lbl}</div>
                </div>
              ))}
            </div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.35)',
              borderRadius: '50px',
              padding: '0.4rem 1.25rem',
              fontSize: '0.88rem',
              fontWeight: 700,
              backdropFilter: 'blur(10px)',
            }}>
              {results.letter}
            </div>
          </div>
        )}

        <div className="card" style={{ marginBottom: '1rem', gap: 0, padding: 0, overflow: 'hidden' }}>
          <div className="card-header" style={{ padding: 'clamp(0.85rem, 3vw, 1.2rem) clamp(1rem, 3vw, 1.5rem)', borderBottom: '1px solid var(--glass-border)', marginBottom: 0 }}>
            <h2 style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)' }}>
              <i className="fa-solid fa-list-check"></i> Added Courses
            </h2>
            <span className="badge">{courses.length} course{courses.length !== 1 ? 's' : ''}</span>
          </div>

          <div style={{ padding: courses.length > 0 ? 'clamp(0.5rem, 2vw, 0.75rem)' : 0 }}>
            {courses.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '0.75rem', padding: '3rem 1.5rem', color: 'var(--text-muted)', textAlign: 'center',
              }}>
                <i className="fa-solid fa-graduation-cap" style={{ fontSize: '2.5rem', opacity: 0.25, color: 'var(--primary)' }}></i>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                  No courses added yet.<br />Go back to the calculator and add courses to your semester.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {courses.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: '#F3F0EB',
                      border: '1.5px solid var(--glass-border)',
                      borderRadius: '14px',
                      padding: '0.7rem 0.9rem',
                      transition: 'border-color 0.2s ease',
                    }}
                  >
                    <div style={{
                      flex: 1, fontWeight: 700, color: 'var(--text-main)',
                      fontSize: 'clamp(0.82rem, 2.5vw, 0.93rem)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {c.credits} CR
                    </div>
                    <div style={{ fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0, fontSize: '0.88rem' }}>
                      <span className={getGradeColorClass(c.grade)}>{c.grade}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}> ({c.gp.toFixed(2)})</span>
                    </div>
                    <button
                      onClick={() => handleDeleteCourse(i)}
                      title="Remove"
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', padding: '0.2rem 0.3rem',
                        borderRadius: '6px', display: 'flex', alignItems: 'center',
                        transition: 'color 0.2s', flexShrink: 0, fontSize: '0.85rem',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="dashboard-btn"
            id="calc-btn"
            onClick={() => calculateCGPA()}
            disabled={courses.length === 0}
            style={{
              flex: 1,
              minWidth: 'min(160px, 100%)',
              padding: '0.85rem 1.25rem',
              fontSize: '0.92rem',
              borderRadius: '14px',
              opacity: courses.length === 0 ? 0.45 : 1,
              cursor: courses.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <i className="fa-solid fa-calculator"></i>
            <span>Calculate Final CGPA</span>
          </button>

          {showResult && (
            <button
              type="button"
              className="dashboard-btn"
              onClick={handleSaveRecord}
              disabled={saveLoading || savedToDb}
              style={{
                flex: 1,
                minWidth: 'min(160px, 100%)',
                padding: '0.85rem 1.25rem',
                fontSize: '0.92rem',
                borderRadius: '14px',
                background: savedToDb
                  ? 'linear-gradient(135deg, #10B981, #059669)'
                  : 'linear-gradient(135deg, var(--secondary), var(--primary))',
                opacity: (saveLoading || savedToDb) ? 0.8 : 1,
                cursor: (saveLoading || savedToDb) ? 'not-allowed' : 'pointer',
              }}
            >
              {saveLoading ? (
                <><i className="fa-solid fa-circle-notch fa-spin"></i><span>Saving...</span></>
              ) : savedToDb ? (
                <><i className="fa-solid fa-check"></i><span>Saved to Profile</span></>
              ) : (
                <><i className="fa-solid fa-floppy-disk"></i><span>Save to Profile</span></>
              )}
            </button>
          )}

          <button
            onClick={handleClearAll}
            title="Clear all courses"
            disabled={courses.length === 0}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid var(--glass-border)',
              color: 'var(--danger)',
              width: '46px',
              borderRadius: '14px',
              cursor: courses.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.95rem',
              flexShrink: 0,
              transition: 'all 0.2s ease',
              opacity: courses.length === 0 ? 0.4 : 1,
            }}
            onMouseEnter={e => { if (courses.length > 0) { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; }}}
            onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
          >
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

      <ConfirmModal
        isOpen={savePromptOpen}
        title="Save CGPA Record?"
        message="Do you want to save your calculated CGPA record to your account before leaving?"
        onConfirm={() => {
          setSavePromptOpen(false);
          setSaveModalOpen(true);
        }}
        onCancel={() => {
          setSavePromptOpen(false);
          if (pendingAction) navigate(pendingAction);
        }}
        confirmText="Yes, Save"
        cancelText="No, Discard"
      />

      <SaveSemesterModal
        isOpen={saveModalOpen}
        cgpa={results.cgpa}
        credits={results.credits}
        coursesCount={courses.length}
        onSave={handlePerformSave}
        onClose={() => setSaveModalOpen(false)}
        loading={saveLoading}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onDone={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
