import { useState } from 'react';
import { createPortal } from 'react-dom';

const DEFAULT_DIST = { quiz: 15, presentation: 8, assignment: 5, attendance: 7, mid: 25, final: 40 };
const DEFAULT_QUIZ = { total: 3, count: 3, method: 'avg' };

export default function SetupModal({ isOpen, onClose, onLaunch }) {
  const [dist, setDist] = useState(DEFAULT_DIST);
  const [quiz, setQuiz] = useState(DEFAULT_QUIZ);

  const total = Object.values(dist).reduce((a, b) => a + (parseInt(b) || 0), 0);
  const isValid = total === 100;

  const handleDist = (key, val) => {
    if (val === '') {
      setDist(prev => ({ ...prev, [key]: '' }));
      return;
    }
    const num = Math.min(100, Math.max(0, parseInt(val, 10) || 0));
    setDist(prev => ({ ...prev, [key]: num }));
  };

  const handleLaunch = () => {
    if (!isValid) return;
    const config = {
      distribution: dist,
      quizSettings: quiz,
    };
    localStorage.setItem('calculatorConfig', JSON.stringify(config));
    onLaunch();
  };

  if (!isOpen) return null;

  const fields = [
    { key: 'quiz',         label: 'Quiz' },
    { key: 'presentation', label: 'Presentation' },
    { key: 'assignment',   label: 'Assignment' },
    { key: 'attendance',   label: 'Attendance' },
    { key: 'mid',          label: 'Mid Term' },
    { key: 'final',        label: 'Final Exam' },
  ];

  return createPortal(
    <div className={`modal-overlay ${isOpen ? 'show' : ''}`} id="setupModal">
      <div className="modal-content setup-modal">
        {/* Header */}
        <div className="modal-header setup-header-custom">
          <div className="setup-title-area">
            <div className="modal-icon-glow">
              <i className="fa-solid fa-gear" style={{ color: '#C41E3A' }}></i>
            </div>
            <div className="setup-title-text">
              <h2>Calculator Setup</h2>
              <p className="setup-subtitle-text">Configure your marks distribution</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close setup modal">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Marks Distribution */}
        <div className="setup-section">
          <div className="section-title">
            <i className="fa-solid fa-chart-pie"></i>
            <span>Marks Distribution</span>
            <div className={`total-badge${!isValid ? ' error' : ''}`} id="totalBadge">
              {total} / 100
            </div>
          </div>
          <div className="marks-grid">
            {fields.map(({ key, label }) => (
              <div key={key} className="mark-input-group">
                <label>{label}</label>
                <input
                  type="number"
                  id={`dist-${key}`}
                  min="0"
                  max="100"
                  value={dist[key]}
                  onChange={e => handleDist(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Config */}
        <div className="setup-section">
          <div className="section-title">
            <i className="fa-solid fa-list-check"></i>
            <span>Quiz Configuration</span>
          </div>
          <div className="quiz-config-grid">
            <div className="mark-input-group">
              <label>Total Quizzes</label>
              <input
                type="number"
                id="quiz-total"
                min="1"
                max="20"
                value={quiz.total}
                onChange={e => {
                  const val = Math.min(20, Math.max(1, parseInt(e.target.value, 10) || 1));
                  setQuiz(q => ({ ...q, total: val, count: Math.min(q.count, val) }));
                }}
              />
            </div>
            <div className="mark-input-group">
              <label>Quizzes to Count</label>
              <input
                type="number"
                id="quiz-count"
                min="1"
                max={quiz.total}
                value={quiz.count}
                onChange={e => {
                  const val = Math.min(quiz.total, Math.max(1, parseInt(e.target.value, 10) || 1));
                  setQuiz(q => ({ ...q, count: val }));
                }}
              />
            </div>
            <div className="mark-input-group full-width">
              <label>Calculation Method</label>
              <div className={`method-toggle ${quiz.method}`}>
                <div className="method-slider"></div>
                <button
                  type="button"
                  className={`method-btn${quiz.method === 'avg' ? ' active' : ''}`}
                  id="method-avg"
                  onClick={() => setQuiz(q => ({ ...q, method: 'avg' }))}
                >
                  Average
                </button>
                <button
                  type="button"
                  className={`method-btn${quiz.method === 'sum' ? ' active' : ''}`}
                  id="method-sum"
                  onClick={() => setQuiz(q => ({ ...q, method: 'sum' }))}
                >
                  Sum / Total
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="dashboard-btn" onClick={handleLaunch} disabled={!isValid}>
            <i className="fa-solid fa-rocket"></i>
            <span>Launch Calculator</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
