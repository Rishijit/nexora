function Topbar({ currentUser, onLogout, onMenuClick }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
          type="button"
          aria-label="Open navigation menu"
        >
          ☰
        </button>

        <div className="brand">
          <div className="brand-icon">N</div>
          <span>Nexora</span>
        </div>
      </div>

      <div className="topbar-right">
        <span className="status-dot"></span>

        <span className="status-text">
          {currentUser?.name
            ? `Welcome, ${currentUser.name}`
            : "Your workspace"}
        </span>

        <div className="profile-circle">
          {currentUser?.name
            ? currentUser.name.charAt(0).toUpperCase()
            : "U"}
        </div>

        <button
          className="logout-button"
          onClick={onLogout}
          type="button"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;