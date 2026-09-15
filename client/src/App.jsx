import { useEffect, useState } from "react";
import API_URL from "./api";
import "./App.css";

import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import QuickActions from "./components/QuickActions";
import RecentActivity from "./components/RecentActivity";
import NoteEditor from "./components/NoteEditor";
import RichTextEditor from "./components/RichTextEditor";
import Login from "./components/Login";
import Register from "./components/Register";
import ComingSoon from "./components/ComingSoon";

import NotesPage from "./NotesPage";
import FilesPage from "./FilesPage";
import TasksPage from "./TasksPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("nexoraToken"))
  );

  const [showRegister, setShowRegister] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("nexoraUser");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const [notes, setNotes] = useState([]);
  const [files, setFiles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");

  // =========================================
  // TASK STATISTICS
  // =========================================

  const completedTaskCount = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTaskCount = tasks.filter(
    (task) => !task.completed
  ).length;

  const overdueTaskCount = tasks.filter((task) => {
    if (!task.dueDate || task.completed) {
      return false;
    }

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(23, 59, 59, 999);

    return new Date() > dueDate;
  }).length;

  const taskCompletionPercentage =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTaskCount / tasks.length) * 100
        );

  // =========================================
  // AUTHENTICATION
  // =========================================

  function handleLogin(user) {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setShowRegister(false);
  }

  function handleLogout() {
    localStorage.removeItem("nexoraToken");
    localStorage.removeItem("nexoraUser");

    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowRegister(false);

    setNotes([]);
    setFiles([]);
    setTasks([]);
  }

  // =========================================
  // PAGE NAVIGATION
  // =========================================

  function handlePageChange(page) {
    setActivePage(page);
    setIsSidebarOpen(false);
  }

  // =========================================
  // FETCH NOTES
  // =========================================

  async function fetchNotes() {
    try {
      const token = localStorage.getItem("nexoraToken");

      const response = await fetch(
        `${API_URL}/api/notes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleLogout();
        return;
      }

      const contentType = response.headers.get(
        "content-type"
      );

      if (
        !contentType ||
        !contentType.includes("application/json")
      ) {
        const responseText = await response.text();

        console.error(
          "Expected JSON but received:",
          responseText
        );

        throw new Error(
          "Backend returned an invalid response."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch notes"
        );
      }

      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }

  // =========================================
  // FETCH FILES
  // =========================================

  async function fetchFiles() {
    try {
      const token = localStorage.getItem("nexoraToken");

      const response = await fetch(
        `${API_URL}/api/files`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await response.json();

      setFiles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  }

  // =========================================
  // FETCH TASKS
  // =========================================

  async function fetchTasks() {
    try {
      const token = localStorage.getItem("nexoraToken");

      const response = await fetch(
        `${API_URL}/api/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  // =========================================
  // FETCH ALL DATA AFTER LOGIN
  // =========================================

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
      fetchFiles();
      fetchTasks();
    }
  }, [isAuthenticated]);

  // =========================================
  // REFRESH TASKS WHEN RETURNING TO DASHBOARD
  // =========================================

  useEffect(() => {
    if (
      isAuthenticated &&
      activePage === "dashboard"
    ) {
      fetchTasks();
    }
  }, [activePage, isAuthenticated]);

  // =========================================
  // AUTHENTICATION SCREEN
  // =========================================

  if (!isAuthenticated) {
    return showRegister ? (
      <Register
        onRegister={() => setShowRegister(false)}
        onShowLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={handleLogin}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  // =========================================
  // MAIN APPLICATION
  // =========================================

  return (
    <div className="app">
      <Topbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="app-layout">
        <Sidebar
          activePage={activePage}
          setActivePage={handlePageChange}
          onNewNote={() => {
            setIsNoteEditorOpen(true);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main
          key={activePage}
          className={`main-content page-transition ${
            activePage === "dashboard"
              ? "dashboard-page"
              : ""
          }`}
        >
          {/* =========================================
              DASHBOARD
          ========================================= */}

          {activePage === "dashboard" && (
            <>
              <div
                className="dashboard-ambient"
                aria-hidden="true"
              >
                <div className="ambient-orb ambient-orb-one"></div>
                <div className="ambient-orb ambient-orb-two"></div>
                <div className="ambient-orb ambient-orb-three"></div>

                <div className="activity-float activity-float-one">
                  <span>🏋️</span>
                </div>

                <div className="activity-float activity-float-two">
                  <span>🚴</span>
                </div>

                <div className="activity-float activity-float-three">
                  <span>📖</span>
                </div>

                <div className="activity-float activity-float-four">
                  <span>💼</span>
                </div>
              </div>

              <section className="welcome-section">
                <div>
                  <p className="eyebrow">
                    PERSONAL WORKSPACE
                  </p>

                  <h1>
                    Good evening,{" "}
                    {currentUser?.name || "User"}.
                  </h1>

                  <p className="welcome-text">
                    Capture ideas, organize files, and plan
                    what comes next.
                  </p>
                </div>

                <button className="search-button">
                  <span>⌕</span>
                  Search
                  <kbd>Ctrl K</kbd>
                </button>
              </section>

              {/* =========================================
                  STATISTICS
              ========================================= */}

              <section className="stats-grid">
                <StatCard
                  icon="▤"
                  iconClass="notes-icon"
                  label="Total Notes"
                  value={notes.length}
                  description="Ready for your ideas"
                />

                <StatCard
                  icon="□"
                  iconClass="files-icon"
                  label="Total Files"
                  value={files.length}
                  description={
                    files.length === 0
                      ? "No files uploaded yet"
                      : "Files in your workspace"
                  }
                />

                <StatCard
                  icon="✓"
                  iconClass="tasks-icon"
                  label="Pending Tasks"
                  value={pendingTaskCount}
                  description={
                    pendingTaskCount === 0
                      ? "Your schedule is clear"
                      : "Tasks waiting for you"
                  }
                />

                <StatCard
                  icon="★"
                  iconClass="tasks-icon"
                  label="Completion Rate"
                  value={`${taskCompletionPercentage}%`}
                  description={`${completedTaskCount} of ${tasks.length} tasks completed`}
                />

                <StatCard
                  icon="⚠"
                  iconClass="tasks-icon"
                  label="Overdue Tasks"
                  value={overdueTaskCount}
                  description={
                    overdueTaskCount === 0
                      ? "Nothing overdue"
                      : "Tasks need your attention"
                  }
                />
              </section>

              {/* =========================================
                  TASK ANALYTICS
              ========================================= */}

              <section className="task-analytics-panel">
                <div className="section-heading">
                  <p className="eyebrow">
                    TASK ANALYTICS
                  </p>

                  <h2>Progress overview</h2>

                  <p>
                    Track how much of your task list you
                    have completed.
                  </p>
                </div>

                <div className="task-progress-header">
                  <span>Overall completion</span>

                  <strong>
                    {taskCompletionPercentage}%
                  </strong>
                </div>

                <div className="task-progress-track">
                  <div
                    className="task-progress-fill"
                    style={{
                      width: `${taskCompletionPercentage}%`,
                    }}
                  ></div>
                </div>

                <div className="task-progress-footer">
                  <span>
                    {completedTaskCount} completed
                  </span>

                  <span>
                    {pendingTaskCount} remaining
                  </span>
                </div>
              </section>

              {/* =========================================
                  DASHBOARD CONTENT
              ========================================= */}

              <section className="content-grid">
                <QuickActions />
                <RecentActivity notes={notes} />
              </section>

              {/* =========================================
                  RICH TEXT EDITOR PREVIEW
              ========================================= */}

              <section className="rich-editor-test-section">
                <div className="section-heading">
                  <p className="eyebrow">
                    EDITOR PREVIEW
                  </p>

                  <h2>Rich Note Editor</h2>
                </div>

                <RichTextEditor />
              </section>
            </>
          )}

          {/* =========================================
              NOTES PAGE
          ========================================= */}

          {activePage === "notes" && <NotesPage />}

          {/* =========================================
              FILES PAGE
          ========================================= */}

          {activePage === "files" && <FilesPage />}

          {/* =========================================
              TASKS PAGE
          ========================================= */}

          {activePage === "tasks" && <TasksPage />}

          {/* =========================================
              SETTINGS PAGE
          ========================================= */}

          {activePage === "settings" && (
            <ComingSoon
              title="Settings"
              description="Manage your profile, preferences, security, and workspace settings."
              icon="⚙"
            />
          )}
        </main>
      </div>

      {/* =========================================
          NEW NOTE MODAL
      ========================================= */}

      {isNoteEditorOpen && (
        <NoteEditor
          onClose={() => {
            setIsNoteEditorOpen(false);
            fetchNotes();
          }}
        />
      )}
    </div>
  );
}

export default App;