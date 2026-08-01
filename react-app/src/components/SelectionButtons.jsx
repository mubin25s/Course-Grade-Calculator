export default function SelectionButtons({ type, selection, onSelect }) {
  const levels = [
    { key: 'poor',      emoji: '😟', label: 'Poor' },
    { key: 'good',      emoji: '😊', label: 'Good' },
    { key: 'excellent', emoji: '🤩', label: 'Excellent' },
  ];

  return (
    <div className="selection-grid" id={`${type}-selection`}>
      {levels.map(({ key, emoji, label }) => (
        <button
          key={key}
          className={`select-btn ${key}${selection?.level === key ? ' active' : ''}`}
          onClick={() => onSelect(type, key)}
        >
          <span className="emoji">{emoji}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
