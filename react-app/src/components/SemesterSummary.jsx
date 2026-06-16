export default function SemesterSummary({
  results, getGradeColorClass, onClear, onGoToCGPA,
}) {
  return (
    <section className="card semester-summary-section">
      <div className="card-header">
        <h2><i className="fa-solid fa-list-check"></i> Semester Summary</h2>
        <div className="summary-actions">
          <button className="icon-btn text-danger" onClick={onClear} title="Clear All">
            <i className="fa-solid fa-trash-can"></i>
          </button>
          <button className="dashboard-btn sm" onClick={onGoToCGPA}>
            <i className="fa-solid fa-calculator"></i>
            <span>Final CGPA</span>
          </button>
        </div>
      </div>
      <div id="semester-list" className="semester-list">
        {results.length === 0 ? (
          <div className="empty-state">No subjects added yet.</div>
        ) : (
          results.map((sub, i) => (
            <div key={i} className="semester-item">
              <div className="sub-name">{sub.name}</div>
              <div className="sub-credits">{sub.credits} CR</div>
              <div className={`sub-grade ${getGradeColorClass(sub.grade)}`}>
                {sub.grade} ({sub.gp.toFixed(2)})
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
