
function StatCard({ icon, iconClass, label, value, description }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${iconClass}`}>{icon}</div>
      <p className="stat-label">{label}</p>
      <h2>{value}</h2>
      <span className="stat-description">{description}</span>
    </div>
  )
}

export default StatCard