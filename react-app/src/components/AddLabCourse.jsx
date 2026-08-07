import { useState } from 'react';

const GP_GRADES = [
  { grade: 'A+', gp: 4.00 },
  { grade: 'A',  gp: 3.75 },
  { grade: 'A-', gp: 3.50 },
  { grade: 'B+', gp: 3.25 },
  { grade: 'B',  gp: 3.00 },
  { grade: 'B-', gp: 2.75 },
  { grade: 'C+', gp: 2.50 },
  { grade: 'C',  gp: 2.25 },
  { grade: 'D+', gp: 2.00 },
  { grade: 'D',  gp: 1.00 },
  { grade: 'F',  gp: 0.00 },
];

export default function AddLabCourse({ gradeThresholds, onAdd }) {
  const [name, setName] = useState('');
  const [credits, setCredits] = useState('');
  const [selectedGP, setSelectedGP] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const gradeOptions = (gradeThresholds && gradeThresholds.length > 0)
    ? gradeThresholds.map(t => ({ grade: t.grade, gp: t.gp }))
    : GP_GRADES;

  const handleAdd = () => {
    const trimmed = name.trim();
    const cr = parseFloat(credits);
    if (!trimmed || isNaN(cr) || cr <= 0 || !selectedGP) return;
    onAdd({ name: trimmed, credits: cr, grade: selectedGP.grade, gp: selectedGP.gp, isLab: true, timestamp: Date.now() });
    setName(''); setCredits(''); setSelectedGP(null); setIsOpen(false);
  };

  const canAdd = name.trim() && parseFloat(credits) > 0 && selectedGP;

  return (
    <div className="lab-add-panel">
      {!isOpen ? (
        <button className="lab-add-toggle-btn" onClick={() => setIsOpen(true)}>
          <i className="fa-solid fa-flask"></i>
          <span>Add Lab / Project Course</span>
          <i className="fa-solid fa-chevron-right lab-toggle-arrow"></i>
        </button>
      ) : (
        <div className="lab-add-form">

          {/* Header */}
          <div className="lab-add-header">
            <div className="lab-header-left">
              <div className="lab-icon-badge">
                <i className="fa-solid fa-flask"></i>
              </div>
              <div>
                <div className="lab-header-title">Lab / Project Course</div>
                <div className="lab-header-sub">Direct grade entry — no marks needed</div>
              </div>
            </div>
            <button className="lab-close-btn" onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Inputs */}
          <div className="lab-inputs-row">
            <div className="lab-input-group" style={{ flex: 2 }}>
              <label><i className="fa-solid fa-book-open" style={{marginRight:'0.3rem',fontSize:'0.7rem'}}></i>Course Name</label>
              <input type="text" placeholder="e.g. Capstone Lab" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="lab-input-group" style={{ flex: 1 }}>
              <label><i className="fa-solid fa-star" style={{marginRight:'0.3rem',fontSize:'0.7rem'}}></i>Credits</label>
              <input type="number" placeholder="1.5" step="0.5" min="0.5" max="6" value={credits} onChange={e => setCredits(e.target.value)} />
            </div>
          </div>

          {/* Grade Picker — horizontal pill scroll with rich purple selected accent */}
          <div className="lab-grade-section">
            <label className="lab-grade-label">
              <i className="fa-solid fa-graduation-cap" style={{marginRight:'0.35rem'}}></i>
              Expected Grade
              {selectedGP && (
                <span className="lab-grade-selected-badge">
                  {selectedGP.grade} · {selectedGP.gp.toFixed(2)}
                </span>
              )}
            </label>
            <div className="lab-grade-scroll">
              {gradeOptions.map(({ grade, gp }) => {
                const isSelected = selectedGP?.grade === grade;
                return (
                  <button
                    key={grade}
                    type="button"
                    className={`lab-grade-pill${isSelected ? ' selected' : ''}`}
                    onClick={() => setSelectedGP({ grade, gp })}
                  >
                    <span className="lab-pill-grade">{grade}</span>
                    <span className="lab-pill-gp">{gp.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add button */}
          <button className="lab-add-btn" onClick={handleAdd} disabled={!canAdd}>
            <i className="fa-solid fa-circle-check"></i>
            <span>
              {canAdd
                ? `Add "${name.trim()}" — ${selectedGP.grade} (${selectedGP.gp.toFixed(2)} GP)`
                : 'Fill name, credits & grade above'}
            </span>
          </button>

        </div>
      )}
    </div>
  );
}
