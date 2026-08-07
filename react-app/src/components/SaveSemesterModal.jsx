import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function SaveSemesterModal({
  isOpen,
  cgpa,
  credits,
  coursesCount,
  onSave,
  onClose,
  loading = false,
}) {
  const [semesterName, setSemesterName] = useState('');

  // Convenient quick suggestions for modern university semesters
  const suggestions = [
    'Spring 2026',
    'Fall 2025',
    'Summer 2026',
    'Semester 1',
    'Semester 2',
    'Semester 3',
  ];

  useEffect(() => {
    if (isOpen) {
      setSemesterName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalName = semesterName.trim() || 'Semester Result';
    onSave(finalName);
  };

  return createPortal(
    <div className={`modal ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="modal-content small" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '1.5rem' }}>
        <div className="modal-header" style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#23212C' }}>
            <i className="fa-solid fa-bookmark" style={{ color: '#C41E3A' }}></i>
            Save Semester Result
          </h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {/* Overview summary */}
        <div style={{
          background: 'rgba(196, 30, 58, 0.05)',
          border: '1px solid rgba(196, 30, 58, 0.15)',
          borderRadius: '14px',
          padding: '0.85rem 1.1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(35, 33, 44, 0.6)', fontWeight: '700' }}>
              Overall Summary
            </span>
            <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#23212C', marginTop: '0.1rem' }}>
              {coursesCount} Course{coursesCount !== 1 ? 's' : ''} &bull; {credits} Credits
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(35, 33, 44, 0.6)', fontWeight: '700', textTransform: 'uppercase' }}>CGPA</span>
            <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#C41E3A', lineHeight: 1 }}>
              {typeof cgpa === 'number' ? cgpa.toFixed(2) : (cgpa || '0.00')}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#23212C', marginBottom: '0.4rem' }}>
              Semester Name / Title
            </label>
            <input
              type="text"
              placeholder="e.g. Spring 26, Fall 2025, Semester 3"
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
              autoFocus
              maxLength={40}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1.5px solid rgba(35, 33, 44, 0.15)',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Quick suggestions */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(35, 33, 44, 0.5)', fontWeight: '600', display: 'block', marginBottom: '0.4rem' }}>
              Quick Suggestions:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {suggestions.map((sug, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setSemesterName(sug)}
                  style={{
                    background: semesterName === sug ? '#C41E3A' : '#F3F0EB',
                    color: semesterName === sug ? '#FFFFFF' : '#23212C',
                    border: '1px solid rgba(35, 33, 44, 0.1)',
                    borderRadius: '50px',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions-centered" style={{ gap: '0.75rem' }}>
            <button type="button" className="dashboard-btn secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="dashboard-btn" disabled={loading}>
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check"></i>}
              <span>Save Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
