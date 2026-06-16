import { useState } from 'react';

const DEFAULT_DIST = { quiz: 15, presentation: 8, assignment: 5, attendance: 7, mid: 25, final: 40 };
const DEFAULT_QUIZ = { total: 3, count: 3, method: 'avg' };

export default function SetupModal({ isOpen, onClose, onLaunch }) {
  const [dist, setDist] = useState(DEFAULT_DIST);
  const [quiz, setQuiz] = useState(DEFAULT_QUIZ);

  const total = Object.values(dist).reduce((a, b) => a + (parseInt(b) || 0), 0);
  const isValid = total === 100;

  const handleDist = (key, val) => setDist(prev => ({ ...prev, [key]: parseInt(val) || 0 }));

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

  return (
    <div className={`modal-overlay ${isOpen ? 'show' : ''}`} id="setupModal">
      <div className="modal-content setup-modal">
        {/* Header */}
        <div className="modal-header setup-header-custom">
          <div className="setup-title-area">
            <div className="modal-icon-glow">
              <i className="fa-solid fa-gear"></i>
            </div>
            <div className="setup-title-text">
              <h2>Calculator<br />Setup</h2>
            </div>
          </div>
          <div className="setup-subtitle">
            <p>Configure your marks<br />distribution</p>
          </div>
          <button className="modal-close" onClick={onClose}>
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
                value={quiz.total}
                onChange={e => setQuiz(q => ({ ...q, total: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div className="mark-input-group">
              <label>Quizzes to Count</label>
              <input
                type="number"
                id="quiz-count"
                value={quiz.count}
                onChange={e => setQuiz(q => ({ ...q, count: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div className="mark-input-group full-width">
              <label>Calculation Method</label>
              <div className="method-toggle">
                <button
                  className={`method-btn${quiz.method === 'avg' ? ' active' : ''}`}
                  id="method-avg"
                  onClick={() => setQuiz(q => ({ ...q, method: 'avg' }))}
                >
                  Average
                </button>
                <button
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
    </div>
  );
}
