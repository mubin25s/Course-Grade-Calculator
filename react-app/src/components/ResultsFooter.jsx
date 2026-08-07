export default function ResultsFooter({
  total, currentGrade, milestone, getGradeColorClass, onAddToSemester,
}) {
  const isTopGrade = milestone.isTopGrade;
  const milestoneLabel = isTopGrade ? 'Achievement' : 'Next Milestone';

  return (
    <div className="results-footer">
      <div className="results-footer-stats">
        <div className="result-item total-marks-container">
          <span className="status-label">Total Marks</span>
          <span className="status-value" id="total-marks">{total.toFixed(2)}</span>
        </div>
        <div className="result-divider"></div>
        <div className="result-item grade-container">
          <span className="status-label">Predicted Grade</span>
          <span className={`status-value ${getGradeColorClass(currentGrade.grade)}`} id="grade-status">
            {currentGrade.grade} ({currentGrade.gp.toFixed(2)})
          </span>
        </div>
        <div className="result-divider"></div>
        <div className="result-item milestone-container">
          <span className="status-label" id="milestone-label">{milestoneLabel}</span>
          <span className={`status-value ${milestone.cls}`} id="needed-pass">{milestone.text}</span>
        </div>
      </div>
      <div className="add-to-result-container">
        <button className="add-btn" onClick={onAddToSemester}>
          <i className="fa-solid fa-plus-circle"></i>
          <span>Add to Semester</span>
        </button>
      </div>
    </div>
  );
}
