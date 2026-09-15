import { useEffect, useState } from "react";
import API_URL from "./api";

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create task states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [label, setLabel] = useState("personal");

  // Filter states
  const [taskFilter, setTaskFilter] = useState("all");
  const [taskSearch, setTaskSearch] = useState("");
  const [taskSort, setTaskSort] = useState("newest");
  const [labelFilter, setLabelFilter] = useState("all");

  // Edit task states
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editDueDate, setEditDueDate] = useState("");
  const [editLabel, setEditLabel] = useState("personal");

  const token = localStorage.getItem("nexoraToken");

  // =========================================
  // FETCH TASKS
  // =========================================

  async function fetchTasks() {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // =========================================
  // CREATE TASK
  // =========================================

  async function handleCreateTask(event) {
    event.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          label,
          dueDate: dueDate || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        console.error("Backend create task error:", errorData);

        throw new Error(
          errorData.message ||
            errorData.error ||
            "Failed to create task"
        );
      }

      const newTask = await response.json();

      setTasks((previousTasks) => [
        newTask,
        ...previousTasks,
      ]);

      // Reset create form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setLabel("personal");
      setDueDate("");
    } catch (error) {
      console.error("Error creating task:", error);
      alert(error.message);
    }
  }

  // =========================================
  // TOGGLE TASK COMPLETION
  // =========================================

  async function handleToggleTask(task) {
    try {
      const response = await fetch(
        `${API_URL}/api/tasks/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: task.title,
            description: task.description,
            priority: task.priority,
            label: task.label || "personal",
            dueDate: task.dueDate,
            completed: !task.completed,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      setTasks((previousTasks) =>
        previousTasks.map((item) =>
          item._id === updatedTask._id ? updatedTask : item
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  // =========================================
  // DELETE TASK
  // =========================================

  async function handleDeleteTask(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((previousTasks) =>
        previousTasks.filter((task) => task._id !== taskId)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  // =========================================
  // OPEN EDIT MODAL
  // =========================================

  function openEditModal(task) {
    setEditingTask(task);
    setEditTitle(task.title || "");
    setEditDescription(task.description || "");
    setEditPriority(task.priority || "medium");
    setEditLabel(task.label || "personal");

    // Convert MongoDB date into yyyy-mm-dd
    setEditDueDate(
      task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : ""
    );
  }

  // =========================================
  // CLOSE EDIT MODAL
  // =========================================

  function closeEditModal() {
    setEditingTask(null);
    setEditTitle("");
    setEditDescription("");
    setEditPriority("medium");
    setEditLabel("personal");
    setEditDueDate("");
  }

  // =========================================
  // SAVE EDITED TASK
  // =========================================

  async function handleSaveEdit(event) {
    event.preventDefault();

    if (!editTitle.trim()) {
      alert("Task title cannot be empty.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/tasks/${editingTask._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
            priority: editPriority,
            label: editLabel,
            dueDate: editDueDate || null,
            completed: editingTask.completed,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save edited task");
      }

      const updatedTask = await response.json();

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );

      closeEditModal();
    } catch (error) {
      console.error("Error saving edited task:", error);
      alert("Could not save task changes.");
    }
  }

  // =========================================
  // FILTER AND SORT TASKS
  // =========================================

  const filteredTasks = tasks
    .filter((task) => {
      if (taskFilter === "pending") {
        return !task.completed;
      }

      if (taskFilter === "completed") {
        return task.completed;
      }

      return true;
    })
    .filter((task) => {
      if (labelFilter === "all") {
        return true;
      }

      return (task.label || "personal") === labelFilter;
    })
    .filter((task) => {
      const searchText = taskSearch.toLowerCase();

      return (
        (task.title || "").toLowerCase().includes(searchText) ||
        (task.description || "")
          .toLowerCase()
          .includes(searchText)
      );
    })
    .sort((a, b) => {
      if (taskSort === "newest") {
        return (
          new Date(b.createdAt) -
          new Date(a.createdAt)
        );
      }

      if (taskSort === "oldest") {
        return (
          new Date(a.createdAt) -
          new Date(b.createdAt)
        );
      }

      if (taskSort === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return (
          new Date(a.dueDate) -
          new Date(b.dueDate)
        );
      }

      if (taskSort === "priority") {
        const priorityOrder = {
          high: 1,
          medium: 2,
          low: 3,
        };

        return (
          priorityOrder[a.priority] -
          priorityOrder[b.priority]
        );
      }

      return 0;
    });

  // =========================================
  // TASK STATISTICS
  // =========================================

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  // =========================================
  // DATE HELPERS
  // =========================================

  function formatDate(date) {
    if (!date) {
      return "No due date";
    }

    return new Date(date).toLocaleDateString();
  }

  function isTaskOverdue(task) {
    if (!task.dueDate || task.completed) {
      return false;
    }

    const dueDate = new Date(task.dueDate);

    // Treat the due date as overdue after the day ends
    dueDate.setHours(23, 59, 59, 999);

    return new Date() > dueDate;
  }

  // =========================================
  // JSX
  // =========================================

  return (
    <section className="tasks-page">
      {/* Page Header */}

      <div className="tasks-page-header">
        <p className="eyebrow">YOUR WORKSPACE</p>

        <h1>My Tasks</h1>

        <p className="tasks-page-description">
          Organize your work, deadlines, and daily priorities.
        </p>
      </div>

      {/* Statistics */}

      <div className="tasks-stats-grid">
        <div className="tasks-stat-card">
          <span className="tasks-stat-label">
            TOTAL TASKS
          </span>

          <strong className="tasks-stat-value">
            {totalTasks}
          </strong>

          <span className="tasks-stat-description">
            Everything on your list
          </span>
        </div>

        <div className="tasks-stat-card">
          <span className="tasks-stat-label">
            PENDING
          </span>

          <strong className="tasks-stat-value">
            {pendingTasks}
          </strong>

          <span className="tasks-stat-description">
            Tasks waiting for you
          </span>
        </div>

        <div className="tasks-stat-card">
          <span className="tasks-stat-label">
            COMPLETED
          </span>

          <strong className="tasks-stat-value">
            {completedTasks}
          </strong>

          <span className="tasks-stat-description">
            Tasks you have finished
          </span>
        </div>
      </div>

      {/* Create Task Form */}

      <div className="task-form-card">
        <div className="task-form-heading">
          <div className="task-form-heading-icon">+</div>

          <div>
            <h2>Create a task</h2>

            <p>
              Add something important to your workspace.
            </p>
          </div>
        </div>

        <form
          className="task-form"
          onSubmit={handleCreateTask}
        >
          <div className="task-form-group">
            <label htmlFor="task-title">
              Task title
            </label>

            <input
              id="task-title"
              className="task-input"
              type="text"
              placeholder="e.g. Complete React practice"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />
          </div>

          <div className="task-form-group">
            <label htmlFor="task-description">
              Description
            </label>

            <textarea
              id="task-description"
              className="task-textarea"
              placeholder="Add some details..."
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            />
          </div>

          <div className="task-form-row">
            <div className="task-form-group">
              <label htmlFor="task-priority">
                Priority
              </label>

              <select
                id="task-priority"
                className="task-select"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value)
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="task-form-group">
              <label htmlFor="task-label">
                Label
              </label>

              <select
                id="task-label"
                className="task-select"
                value={label}
                onChange={(event) =>
                  setLabel(event.target.value)
                }
              >
                <option value="personal">
                  Personal
                </option>
                <option value="study">Study</option>
                <option value="work">Work</option>
                <option value="project">
                  Project
                </option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="task-form-group">
              <label htmlFor="task-due-date">
                Due date
              </label>

              <input
                id="task-due-date"
                className="task-date-input"
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(event.target.value)
                }
              />
            </div>
          </div>

          <button
            className="create-task-button"
            type="submit"
          >
            <span>+</span>
            Create Task
          </button>
        </form>
      </div>

      {/* Task List */}

      <div className="tasks-list-section">
        <div className="tasks-list-header">
          <div>
            <p className="eyebrow">YOUR TASKS</p>
            <h2>Task list</h2>
          </div>
        </div>

        {/* Search and Sort Controls */}

        <div className="task-controls">
          <input
            type="text"
            placeholder="Search tasks..."
            value={taskSearch}
            onChange={(event) =>
              setTaskSearch(event.target.value)
            }
          />

          <select
            value={taskSort}
            onChange={(event) =>
              setTaskSort(event.target.value)
            }
          >
            <option value="newest">
              Newest first
            </option>

            <option value="oldest">
              Oldest first
            </option>

            <option value="dueDate">
              Due date
            </option>

            <option value="priority">
              Priority
            </option>
          </select>
        </div>

        {/* Completion Filters */}

        <div className="task-filters">
          <button
            type="button"
            className={`task-filter-button ${
              taskFilter === "all" ? "active" : ""
            }`}
            onClick={() => setTaskFilter("all")}
          >
            All
          </button>

          <button
            type="button"
            className={`task-filter-button ${
              taskFilter === "pending" ? "active" : ""
            }`}
            onClick={() => setTaskFilter("pending")}
          >
            Pending
          </button>

          <button
            type="button"
            className={`task-filter-button ${
              taskFilter === "completed" ? "active" : ""
            }`}
            onClick={() =>
              setTaskFilter("completed")
            }
          >
            Completed
          </button>
        </div>

        {/* Label Filters */}

        <div className="task-label-filters">
          <button
            type="button"
            className={`task-filter-button ${
              labelFilter === "all" ? "active" : ""
            }`}
            onClick={() => setLabelFilter("all")}
          >
            All Labels
          </button>

          <button
            type="button"
            className={`task-filter-button ${
              labelFilter === "personal" ? "active" : ""
            }`}
            onClick={() =>
              setLabelFilter("personal")
            }
          >
            Personal
          </button>

          <button
            type="button"
            className={`task-filter-button ${
              labelFilter === "study" ? "active" : ""
            }`}
            onClick={() => setLabelFilter("study")}
          >
            Study
          </button>

          <button
            type="button"
            className={`task-filter-button ${
              labelFilter === "work" ? "active" : ""
            }`}
            onClick={() => setLabelFilter("work")}
          >
            Work
          </button>

          <button
            type="button"
            className={`task-filter-button ${
              labelFilter === "project" ? "active" : ""
            }`}
            onClick={() =>
              setLabelFilter("project")
            }
          >
            Project
          </button>

          <button
            type="button"
            className={`task-filter-button ${
              labelFilter === "urgent" ? "active" : ""
            }`}
            onClick={() =>
              setLabelFilter("urgent")
            }
          >
            Urgent
          </button>
        </div>

        {/* Task Content */}

        {loading ? (
          <div className="empty-tasks-card">
            <div className="empty-tasks-icon">◌</div>

            <h2>Loading tasks...</h2>

            <p>
              Your workspace is preparing your task list.
            </p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-tasks-card">
            <div className="empty-tasks-icon">✓</div>

            <h2>No tasks here</h2>

            <p>
              Create a task or change the filter to see
              your work.
            </p>
          </div>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <article
                className={`task-card ${
                  task.completed ? "completed" : ""
                } ${
                  isTaskOverdue(task) ? "overdue" : ""
                }`}
                key={task._id}
              >
                <div className="task-card-header">
                  <div className="task-card-title-row">
                    <input
                      className="task-checkbox"
                      type="checkbox"
                      checked={task.completed}
                      onChange={() =>
                        handleToggleTask(task)
                      }
                      aria-label={`Mark ${
                        task.title
                      } as ${
                        task.completed
                          ? "pending"
                          : "completed"
                      }`}
                    />

                    <h3>{task.title}</h3>
                  </div>

                  <span
                    className={`task-priority ${task.priority}`}
                  >
                    {task.priority}
                  </span>
                </div>

                {task.description && (
                  <p className="task-card-description">
                    {task.description}
                  </p>
                )}

                <div className="task-card-meta">
                  <span
                    className={`task-priority ${task.priority}`}
                  >
                    {task.priority}
                  </span>

                  <span
                    className={`task-label ${
                      task.label || "personal"
                    }`}
                  >
                    {task.label || "personal"}
                  </span>

                  {task.dueDate && (
                    <span
                      className={`task-due-date ${
                        isTaskOverdue(task)
                          ? "overdue-date"
                          : ""
                      }`}
                    >
                      {isTaskOverdue(task)
                        ? "⚠"
                        : "📅"}{" "}
                      {isTaskOverdue(task)
                        ? `Overdue · ${formatDate(
                            task.dueDate
                          )}`
                        : formatDate(task.dueDate)}
                    </span>
                  )}
                </div>

                <div className="task-card-actions">
                  <button
                    type="button"
                    className="task-edit-button"
                    onClick={() =>
                      openEditModal(task)
                    }
                  >
                    ✎ Edit
                  </button>

                  <button
                    type="button"
                    className="task-delete-button"
                    onClick={() =>
                      handleDeleteTask(task._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Edit Task Modal */}

      {editingTask && (
        <div
          className="task-modal-overlay"
          onClick={closeEditModal}
        >
          <div
            className="task-edit-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="task-modal-header">
              <div>
                <p className="eyebrow">TASK MANAGER</p>

                <h2>Edit task</h2>

                <p>
                  Update the details of your task.
                </p>
              </div>

              <button
                type="button"
                className="task-modal-close"
                onClick={closeEditModal}
                aria-label="Close edit task modal"
              >
                ×
              </button>
            </div>

            <form
              className="task-edit-form"
              onSubmit={handleSaveEdit}
            >
              <div className="task-form-group">
                <label htmlFor="edit-task-title">
                  Task title
                </label>

                <input
                  id="edit-task-title"
                  className="task-input"
                  type="text"
                  value={editTitle}
                  onChange={(event) =>
                    setEditTitle(event.target.value)
                  }
                />
              </div>

              <div className="task-form-group">
                <label htmlFor="edit-task-description">
                  Description
                </label>

                <textarea
                  id="edit-task-description"
                  className="task-textarea"
                  value={editDescription}
                  onChange={(event) =>
                    setEditDescription(event.target.value)
                  }
                />
              </div>

              <div className="task-form-row">
                <div className="task-form-group">
                  <label htmlFor="edit-task-priority">
                    Priority
                  </label>

                  <select
                    id="edit-task-priority"
                    className="task-select"
                    value={editPriority}
                    onChange={(event) =>
                      setEditPriority(event.target.value)
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">
                      Medium
                    </option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="task-form-group">
                  <label htmlFor="edit-task-label">
                    Label
                  </label>

                  <select
                    id="edit-task-label"
                    className="task-select"
                    value={editLabel}
                    onChange={(event) =>
                      setEditLabel(event.target.value)
                    }
                  >
                    <option value="personal">
                      Personal
                    </option>
                    <option value="study">Study</option>
                    <option value="work">Work</option>
                    <option value="project">
                      Project
                    </option>
                    <option value="urgent">
                      Urgent
                    </option>
                  </select>
                </div>

                <div className="task-form-group">
                  <label htmlFor="edit-task-due-date">
                    Due date
                  </label>

                  <input
                    id="edit-task-due-date"
                    className="task-date-input"
                    type="date"
                    value={editDueDate}
                    onChange={(event) =>
                      setEditDueDate(event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="task-modal-actions">
                <button
                  type="button"
                  className="task-cancel-button"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="task-save-button"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default TasksPage;