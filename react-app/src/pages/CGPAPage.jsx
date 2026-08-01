import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import BackgroundGlobes from '../components/BackgroundGlobes';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

export default function CGPAPage() {
  const navigate = useNavigate();
  const { user, saveCgpaRecord } = useAuth();
  const [addedCourses, setAddedCourses] = useState([]);
  const [activeRows, setActiveRows] = useState([
    { id: 1, name: '', credit: '', gradePoint: '' }
  ]);
  const [results, setResults] = useState({ cgpa: 0, credits: 0, points: 0 });
  const [showResult, setShowResult] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const rowIdCounter = useRef(2);

  const [saveLoading, setSaveLoading] = useState(false);
  const [savedToDb, setSavedToDb] = useState(false);
  const [savePromptOpen, setSavePromptOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const getGradeTextByGP = (gp) => {
    const map = {
      4.00: 'A+', 3.75: 'A', 3.50: 'A-', 3.25: 'B+', 3.00: 'B',
      2.75: 'B-', 2.50: 'C+', 2.25: 'C', 2.00: 'D', 0.00: 'F'
    };
    return map[gp] || '';
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleActiveRowChange = (id, field, value) => {
    setActiveRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleRemoveActiveRow = (id) => {
    if (activeRows.length === 1 && addedCourses.length === 0) {
      showToast('At least one course row is required.', 'warning');
      return;
    }
    setActiveRows(prev => prev.filter(row => row.id !== id));
  };

  const handleAddCoursesToFinal = () => {
    let newlyAdded = [];
    let hasInvalid = false;
    let nextActiveRows = [...activeRows];

    for (const row of activeRows) {
      const credit = parseFloat(row.credit);
      const gradePoint = parseFloat(row.gradePoint);
      const name = row.name.trim() || 'Untitled Course';

      if (isNaN(credit) || isNaN(gradePoint)) {
        hasInvalid = true;
        continue;
      }

      newlyAdded.push({ name, credit, gradePoint });
      // Remove this row from active rows since it's finalized
      nextActiveRows = nextActiveRows.filter(r => r.id !== row.id);
    }

    if (newlyAdded.length > 0) {
      const nextAddedCourses = [...addedCourses, ...newlyAdded];
      setAddedCourses(nextAddedCourses);
      showToast('Course(s) added to final calculation!', 'success');

      // If all active rows were added, insert a new empty row
      if (nextActiveRows.length === 0) {
        nextActiveRows = [{ id: rowIdCounter.current++, name: '', credit: '', gradePoint: '' }];
      }
      setActiveRows(nextActiveRows);

      // Recalculate results quietly
      calculateCGPAValue(nextAddedCourses, false);
    } else {
      if (hasInvalid) {
        showToast('Please fill in credits and grade for at least one course.', 'warning');
      }
    }
  };

  const calculateCGPAValue = (coursesList, triggerVisualShow = true) => {
    if (coursesList.length === 0) {
      if (triggerVisualShow) showToast('No courses added yet!', 'warning');
      return;
    }

    let totalCredits = 0;
    let totalPoints = 0;

    coursesList.forEach(course => {
      totalCredits += course.credit;
      totalPoints += course.credit * course.gradePoint;
    });

    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    setResults({ cgpa, credits: totalCredits, points: totalPoints });
    setSavedToDb(false);

    if (triggerVisualShow) {
      setShowResult(true);
      // Simple visual scroll to results panel
      setTimeout(() => {
        const panel = document.getElementById('resultPanel');
        if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const handleCalculateOverallCGPA = () => {
    // If there are filled active rows, automatically try to finalise them first
    const filledActive = activeRows.filter(r => !isNaN(parseFloat(r.credit)) && !isNaN(parseFloat(r.gradePoint)));
    let currentList = [...addedCourses];

    if (filledActive.length > 0) {
      let newlyAdded = [];
      let nextActiveRows = [...activeRows];

      for (const row of filledActive) {
        const credit = parseFloat(row.credit);
        const gradePoint = parseFloat(row.gradePoint);
        const name = row.name.trim() || 'Untitled Course';

        newlyAdded.push({ name, credit, gradePoint });
        nextActiveRows = nextActiveRows.filter(r => r.id !== row.id);
      }

      currentList = [...addedCourses, ...newlyAdded];
      setAddedCourses(currentList);
      if (nextActiveRows.length === 0) {
        nextActiveRows = [{ id: rowIdCounter.current++, name: '', credit: '', gradePoint: '' }];
      }
      setActiveRows(nextActiveRows);
    }

    if (currentList.length === 0) {
      showToast('Please add courses first!', 'warning');
      return;
    }

    calculateCGPAValue(currentList, true);
  };

  const handleReset = () => {
    setAddedCourses([]);
    setActiveRows([{ id: rowIdCounter.current++, name: '', credit: '', gradePoint: '' }]);
    setResults({ cgpa: 0, credits: 0, points: 0 });
    setShowResult(false);
    setSavedToDb(false);
  };

  const handleSaveRecord = async () => {
    if (addedCourses.length === 0) return;
    
    const record = {
      cgpa: results.cgpa,
      credits: results.credits,
      points: results.points,
      courses: addedCourses.map(c => ({
        name: c.name,
        credits: c.credit,
        gp: c.gradePoint,
        grade: getGradeTextByGP(c.gradePoint)
      })),
      calculatorType: 'manual'
    };

    if (!user) {
      sessionStorage.setItem('pendingSaveCGPA', JSON.stringify(record));
      showToast('Redirecting to login to save your record...', 'warning');
      setTimeout(() => {
        navigate('/auth?redirect=save-pending');
      }, 1500);
      return;
    }

    setSaveLoading(true);
    try {
      const res = await saveCgpaRecord(user.uid, record);
      if (res.success) {
        setSavedToDb(true);
        showToast('CGPA record successfully saved to your profile!', 'success');
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
    if (showResult && !savedToDb && addedCourses.length > 0) {
      setPendingAction(targetPath);
      setSavePromptOpen(true);
    } else {
      navigate(targetPath);
    }
  };

  return (
    <div className="universal-calc-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'clamp(1rem, 3vw, 2rem) clamp(0.75rem, 3vw, 1.25rem)' }}>
      <BackgroundGlobes />

      <div className="container cgpa-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {/* Top Navigation Row */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <a href="/" onClick={(e) => { e.preventDefault(); handleBackClick('/'); }} className="back-link" style={{ marginBottom: 0 }}>
            <i className="fa-solid fa-arrow-left"></i> Dashboard
          </a>
          <div className="construction-banner" style={{ position: 'static', margin: 0 }}>
            <i className="fa-solid fa-screwdriver-wrench"></i>
            <span>More tools coming soon!</span>
          </div>
        </div>

        <header style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 5vw, 3.5rem)', width: '100%' }}>
          <div className="header-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <img src="/LOGO.png" alt="Logo" style={{ width: 'clamp(54px, 14vw, 80px)', height: 'clamp(54px, 14vw, 80px)', objectFit: 'contain', display: 'block' }} />
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '0.5rem', color: 'var(--primary)' }}>CGPA Calculator</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)', maxWidth: 500, margin: '0 auto', lineHeight: 1.5 }}>Calculate your cumulative grade point average with modern precision and style.</p>
        </header>

        <div className="calculator-card" style={{ width: '100%', maxWidth: 'min(1000px, 100%)' }}>
          <div className="course-list" id="courseList">
            {/* Render Finalized Courses */}
            {addedCourses.map((course, idx) => (
              <div key={`final-${idx}`} className="course-row added-to-final" style={{ opacity: 0.7, pointerEvents: 'none', background: 'rgba(16, 185, 129, 0.05)' }}>
                <div className="course-input-group">
                  <label><i className="fa-solid fa-book-open"></i> Course Name</label>
                  <input type="text" className="course-input" value={course.name} disabled />
                </div>
                <div className="course-input-group">
                  <label><i className="fa-solid fa-hashtag"></i> Credits</label>
                  <input type="text" className="course-input" value={course.credit} disabled />
                </div>
                <div className="course-input-group">
                  <label><i className="fa-solid fa-medal"></i> Grade</label>
                  <input type="text" className="course-input" value={`${getGradeTextByGP(course.gradePoint)} (${course.gradePoint.toFixed(2)})`} disabled />
                </div>
                <button className="btn-delete" disabled style={{ opacity: 0.3 }}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}

            {/* Render Active Input Rows */}
            {activeRows.map(row => (
              <div key={row.id} className="course-row">
                <div className="course-input-group">
                  <label><i className="fa-solid fa-book-open"></i> Course Name</label>
                  <input
                    type="text"
                    className="course-input input-name"
                    placeholder="Software Engineering"
                    value={row.name}
                    onChange={(e) => handleActiveRowChange(row.id, 'name', e.target.value)}
                  />
                </div>
                <div className="course-input-group">
                  <label><i className="fa-solid fa-hashtag"></i> Credits</label>
                  <input
                    type="number"
                    className="course-input input-credit"
                    placeholder="3.0"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={row.credit}
                    onChange={(e) => handleActiveRowChange(row.id, 'credit', e.target.value)}
                  />
                </div>
                <div className="course-input-group">
                  <label><i className="fa-solid fa-medal"></i> Grade</label>
                  <select
                    className="course-input input-grade"
                    value={row.gradePoint}
                    onChange={(e) => handleActiveRowChange(row.id, 'gradePoint', e.target.value)}
                    style={{ background: '#F3F0EB', color: '#23212C', width: '100%' }}
                  >
                    <option value="" disabled>Select</option>
                    <option value="4.00">A+ (4.00)</option>
                    <option value="3.75">A (3.75)</option>
                    <option value="3.50">A- (3.50)</option>
                    <option value="3.25">B+ (3.25)</option>
                    <option value="3.00">B (3.00)</option>
                    <option value="2.75">B- (2.75)</option>
                    <option value="2.50">C+ (2.50)</option>
                    <option value="2.25">C (2.25)</option>
                    <option value="2.00">D (2.00)</option>
                    <option value="0.00">F (0.00)</option>
                  </select>
                </div>
                <button className="btn-delete" onClick={() => handleRemoveActiveRow(row.id)}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}
          </div>

          <div className="controls">
            <button className="btn-action btn-add" onClick={handleAddCoursesToFinal}>
              <i className="fa-solid fa-plus"></i> Calculate &amp; Add Subject
            </button>
            <button className="btn-action btn-calc" onClick={handleCalculateOverallCGPA}>
              <i className="fa-solid fa-chart-line"></i> Final CGPA
            </button>
            <button className="btn-action btn-reset" onClick={handleReset}>
              <i className="fa-solid fa-rotate-left"></i>
            </button>
          </div>

          <div className={`results-panel ${showResult ? 'visible' : ''}`} id="resultPanel" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <div className="result-item result-cgpa">
              <span className="result-label"><i className="fa-solid fa-trophy"></i> Your CGPA</span>
              <span className="result-value" id="cgpaValue">{results.cgpa.toFixed(2)}</span>
            </div>
            <div className="result-item result-credits">
              <span className="result-label"><i className="fa-solid fa-graduation-cap"></i> Total Credits</span>
              <span className="result-value" id="totalCredits">{results.credits.toFixed(1)}</span>
            </div>
            <div className="result-item result-points">
              <span className="result-label"><i className="fa-solid fa-coins"></i> Total Points</span>
              <span className="result-value" id="totalPoints">{results.points.toFixed(1)}</span>
            </div>
          </div>
          
          {showResult && addedCourses.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  padding: '0.85rem 2rem',
                  borderRadius: '50px',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '1rem',
                  boxShadow: '0 10px 25px rgba(109,0,26,0.3)'
                }}
                onClick={handleSaveRecord}
                disabled={saveLoading || savedToDb}
              >
                {saveLoading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i> Saving...
                  </>
                ) : savedToDb ? (
                  <>
                    <i className="fa-solid fa-check"></i> Saved to Profile
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk"></i> Save to Profile
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={savePromptOpen}
        title="Save CGPA Record?"
        message="Do you want to save your manually calculated CGPA record to your account before leaving?"
        onConfirm={async () => {
          setSavePromptOpen(false);
          const record = {
            cgpa: results.cgpa,
            credits: results.credits,
            points: results.points,
            courses: addedCourses.map(c => ({
              name: c.name,
              credits: c.credit,
              gp: c.gradePoint,
              grade: getGradeTextByGP(c.gradePoint)
            })),
            calculatorType: 'manual'
          };
          if (!user) {
            sessionStorage.setItem('pendingSaveCGPA', JSON.stringify(record));
            navigate('/auth?redirect=save-pending');
          } else {
            await saveCgpaRecord(user.uid, record);
            if (pendingAction) {
              navigate(pendingAction);
            }
          }
        }}
        onCancel={() => {
          setSavePromptOpen(false);
          if (pendingAction) {
            navigate(pendingAction);
          }
        }}
        confirmText="Yes, Save"
        cancelText="No, Discard"
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onDone={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
