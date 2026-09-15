
function QuickActions() {
  return (
    <div className="panel quick-actions-panel">
      <div className="panel-heading">
        <div>
          <h2>Quick Actions</h2>
          <p>Start organizing your workspace.</p>
        </div>
      </div>

      <div className="quick-actions">
        <button className="action-card">
          <span className="action-icon">+</span>
          <span>
            <strong>Create a note</strong>
            <small>Write down an idea</small>
          </span>
          <span className="action-arrow">→</span>
        </button>

        <button className="action-card">
          <span className="action-icon folder-action">□</span>
          <span>
            <strong>Upload a file</strong>
            <small>Keep documents organized</small>
          </span>
          <span className="action-arrow">→</span>
        </button>

        <button className="action-card">
          <span className="action-icon task-action">✓</span>
          <span>
            <strong>Plan a task</strong>
            <small>Schedule something important</small>
          </span>
          <span className="action-arrow">→</span>
        </button>
      </div>
    </div>
  )
}

export default QuickActions