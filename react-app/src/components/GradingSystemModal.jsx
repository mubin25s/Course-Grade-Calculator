import { systemsData } from '../data/gradingSystems';

export default function GradingSystemModal({ isOpen, onClose, onApply }) {
  if (!isOpen) return null;

  const systems = [
    { id: 1, name: 'Standard',       desc: 'A+ starts at 80' },
    { id: 2, name: 'Advanced',        desc: 'A starts at 90' },
    { id: 3, name: 'Strict (Decimal)',desc: 'A+ starts at 94' },
    { id: 4, name: 'Elite',           desc: 'A starts at 93 | F below 60' },
  ];

  return (
    <div id="systemModal" className={`modal ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3><i className="fa-solid fa-graduation-cap"></i> Select Grading System</h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        <p className="instruction">Choose the grading standard that matches your university.</p>
        <div className="system-options">
          {systems.map(s => (
            <div key={s.id} className="system-card" onClick={() => { onApply(s.id); onClose(); }}>
              <div className="system-info">
                <h4>{s.name}</h4>
                <p>{s.desc}</p>
              </div>
              <i className="fa-solid fa-check-circle"></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
