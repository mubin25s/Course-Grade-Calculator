export default function QuizInputs({ total, quizMax, values, onChange }) {
  const handleChange = (i, val) => {
    const clamped = Math.min(Math.max(parseFloat(val) || 0, 0), quizMax);
    const next = [...values];
    next[i] = val === '' ? '' : String(clamped);
    onChange(next);
  };

  return (
    <div id="quiz-inputs-container" className="inputs-row">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="input-group">
          <label>Quiz {i + 1}</label>
          <input
            type="number"
            id={`quiz-${i + 1}`}
            placeholder={String(quizMax)}
            min="0"
            max={quizMax}
            value={values[i] ?? ''}
            onChange={e => handleChange(i, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
