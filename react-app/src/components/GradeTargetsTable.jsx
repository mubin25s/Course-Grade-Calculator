export default function GradeTargetsTable({ targets, getGradeColorClass, onOpenSystem }) {
  return (
    <section className="card grade-targets">
      <div className="card-header">
        <h2><i className="fa-solid fa-bullseye"></i> Grade Targets</h2>
        <button className="icon-btn" onClick={onOpenSystem}>
          <i className="fa-solid fa-gear"></i>
        </button>
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Grade</th>
              <th>Points</th>
              <th>Range</th>
              <th>Requirement</th>
            </tr>
          </thead>
          <tbody id="grade-targets-body">
            {targets.map((t, i) => (
              <tr key={i}>
                <td className={getGradeColorClass(t.grade)}>{t.grade}</td>
                <td className="gp-text">{t.gp.toFixed(2)}</td>
                <td>{t.min} – {t.max}</td>
                <td>
                  <span className={`status-pill ${t.sClass}`}>{t.statusText}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
