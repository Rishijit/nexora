function Sidebar({
  activePage,
  setActivePage,
  onNewNote,
  isOpen,
  onClose,
}) {
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "⌂",
    },
    {
      id: "notes",
      label: "My Notes",
      icon: "▤",
    },
    {
      id: "files",
      label: "Files",
      icon: "□",
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: "✓",
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
        ></div>
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-inner">
          {/* Sidebar brand */}

          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">N</div>

            <div className="sidebar-brand-text">
              <strong>Nexora</strong>
              <span>YOUR WORKSPACE</span>
            </div>

            <button
              className="sidebar-close-button"
              onClick={onClose}
              type="button"
              aria-label="Close navigation menu"
            >
              ×
            </button>
          </div>

          {/* New note button */}

          <button
            className="new-note-button"
            onClick={onNewNote}
            type="button"
          >
            <span className="new-note-plus">+</span>
            <span className="new-note-label">New Note</span>
            <span className="new-note-shortcut">Ctrl N</span>
          </button>

          {/* Main navigation */}

          <nav className="sidebar-nav">
            <p className="sidebar-section-label">WORKSPACE</p>

            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${
                  activePage === item.id ? "active" : ""
                }`}
                onClick={() => setActivePage(item.id)}
                type="button"
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                <span className="nav-arrow">›</span>
              </button>
            ))}
          </nav>

          {/* Decorative quote area */}

          <div className="sidebar-quote">
            <span className="quote-mark">“</span>

            <p>
              Small steps every day
              <br />
              lead to big results.
            </p>

            <span className="quote-line"></span>
          </div>

          {/* Bottom area */}

          <div className="sidebar-bottom">
            <button
              className={`nav-item settings-item ${
                activePage === "settings" ? "active" : ""
              }`}
              onClick={() => setActivePage("settings")}
              type="button"
            >
              <span className="nav-icon">⚙</span>
              <span className="nav-label">Settings</span>
              <span className="nav-arrow">›</span>
            </button>

            <div className="workspace-status-card">
              <div className="workspace-status-dot"></div>

              <div className="workspace-status-content">
                <strong>Workspace ready</strong>
                <span>Stay productive!</span>
              </div>

              <div className="workspace-wave">〰</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;