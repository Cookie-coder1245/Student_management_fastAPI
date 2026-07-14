export default function StatsBar({ total, shown, cities }) {
  return (
    <div className="stats-bar">
      <div className="stat">
        <span className="stat__value">{total}</span>
        <span className="stat__label">on the roster</span>
      </div>
      <div className="stat-divider" />
      <div className="stat">
        <span className="stat__value">{shown}</span>
        <span className="stat__label">currently shown</span>
      </div>
      <div className="stat-divider" />
      <div className="stat">
        <span className="stat__value">{cities}</span>
        <span className="stat__label">cities represented</span>
      </div>
    </div>
  );
}
