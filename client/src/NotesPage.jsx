import { useEffect, useState } from "react";
import RichTextEditor from "./components/RichTextEditor";
import API_URL from "./api";

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const token = localStorage.getItem("nexoraToken");

  async function fetchNotes() {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/notes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch notes");
      }

      setNotes(data);
    } catch (error) {
      console.error("Fetch notes error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  async function handleUpdateNote(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/notes/${editingNote._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
  title: editingNote.title,
  content: editingNote.content,
  pinned: editingNote.pinned || false,
  tags: editingNote.tags || [],
}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update note");
      }

      setNotes((previousNotes) =>
        previousNotes
          .map((note) =>
            note._id === data._id ? data : note
          )
          .sort((a, b) => {
            if (a.pinned !== b.pinned) {
              return Number(b.pinned) - Number(a.pinned);
            }

            return (
              new Date(b.createdAt) -
              new Date(a.createdAt)
            );
          })
      );

      setEditingNote(null);
    } catch (error) {
      console.error("Update note error:", error);
      alert(error.message);
    }
  }

  async function handleDeleteNote(noteId) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/notes/${noteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete note");
      }

      setNotes((previousNotes) =>
        previousNotes.filter((note) => note._id !== noteId)
      );
    } catch (error) {
      console.error("Delete note error:", error);
      alert(error.message);
    }
  }

  async function handleTogglePin(note) {
    try {
      const response = await fetch(
        `${API_URL}/api/notes/${note._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
  title: note.title,
  content: note.content,
  pinned: !note.pinned,
  tags: note.tags || [],
}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update pin status");
      }

      setNotes((previousNotes) =>
        previousNotes
          .map((previousNote) =>
            previousNote._id === data._id
              ? data
              : previousNote
          )
          .sort((a, b) => {
            if (a.pinned !== b.pinned) {
              return Number(b.pinned) - Number(a.pinned);
            }

            return (
              new Date(b.createdAt) -
              new Date(a.createdAt)
            );
          })
      );
    } catch (error) {
      console.error("Toggle pin error:", error);
      alert(error.message);
    }
  }

  const allTags = [
  ...new Set(
    notes.flatMap((note) =>
      Array.isArray(note.tags) ? note.tags : []
    )
  ),
].sort();
const totalNotes = notes.length;

const pinnedNotes = notes.filter(
  (note) => note.pinned
).length;

const totalTags = allTags.length;

const filteredNotes = notes.filter((note) => {
  const searchText = searchTerm.toLowerCase();

  const matchesSearch =
    note.title.toLowerCase().includes(searchText) ||
    note.content.toLowerCase().includes(searchText);

  const matchesTag =
    !selectedTag ||
    (Array.isArray(note.tags) &&
      note.tags.includes(selectedTag));

  return matchesSearch && matchesTag;
});

  return (
    <section className="notes-page">
      <div className="notes-page-header">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>My Notes</h1>
          <p className="notes-page-description">
            Capture ideas, reminders, and important thoughts.
          </p>
        </div>
      </div>
      <div className="notes-stats-grid">
  <div className="notes-stat-card">
    <span className="notes-stat-label">TOTAL NOTES</span>
    <strong className="notes-stat-value">
      {totalNotes}
    </strong>
    <span className="notes-stat-description">
      Notes in your workspace
    </span>
  </div>

  <div className="notes-stat-card">
    <span className="notes-stat-label">PINNED NOTES</span>
    <strong className="notes-stat-value">
      {pinnedNotes}
    </strong>
    <span className="notes-stat-description">
      Important notes saved
    </span>
  </div>

  <div className="notes-stat-card">
    <span className="notes-stat-label">TOTAL TAGS</span>
    <strong className="notes-stat-value">
      {totalTags}
    </strong>
    <span className="notes-stat-description">
      Categories you created
    </span>
  </div>
</div>

      <div className="notes-search-section">
        <div className="notes-search-wrapper">
          <span className="notes-search-icon">⌕</span>

          <input
            type="text"
            className="notes-search-input"
            placeholder="Search your notes..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

          {searchTerm && (
            <button
              type="button"
              className="notes-search-clear"
              onClick={() => setSearchTerm("")}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <p className="notes-result-count">
          {filteredNotes.length}{" "}
          {filteredNotes.length === 1 ? "note" : "notes"} found
        </p>
        {allTags.length > 0 && (
  <div className="tag-filter-section">
    <button
      type="button"
      className={`tag-filter-button ${
        selectedTag === "" ? "active-tag-filter" : ""
      }`}
      onClick={() => setSelectedTag("")}
    >
      All
    </button>

    {allTags.map((tag) => (
      <button
        type="button"
        className={`tag-filter-button ${
          selectedTag === tag ? "active-tag-filter" : ""
        }`}
        onClick={() => setSelectedTag(tag)}
        key={tag}
      >
        #{tag}
      </button>
    ))}
  </div>
)}
      </div>

      {loading ? (
        <div className="empty-notes-card">
          <p>Loading your notes...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="empty-notes-card">
          <div className="empty-notes-icon">▤</div>

          <h2>
            {searchTerm ? "No matching notes" : "No notes yet"}
          </h2>

          <p>
            {searchTerm
              ? "Try searching with a different keyword."
              : "Create your first note to start organizing your ideas."}
          </p>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <article
              className={`note-card ${
                note.pinned ? "pinned-note-card" : ""
              }`}
              key={note._id}
            >
              <div className="note-card-top">
                <div className="note-label-group">
                  <span className="note-label">NOTE</span>

                  {note.pinned && (
                    <span className="pinned-label">
                      📌 PINNED
                    </span>
                  )}
                </div>

                <div className="note-card-actions">
                  <button
                    type="button"
                    className={`note-action-button pin-action-button ${
                      note.pinned ? "active-pin-button" : ""
                    }`}
                    onClick={() => handleTogglePin(note)}
                    title={
                      note.pinned
                        ? "Unpin note"
                        : "Pin note"
                    }
                  >
                    {note.pinned ? "★" : "☆"}
                  </button>

                  <button
                    type="button"
                    className="note-action-button"
                    onClick={() => setEditingNote(note)}
                    title="Edit note"
                  >
                    ✎
                  </button>

                  <button
                    type="button"
                    className="note-action-button delete-action"
                    onClick={() => handleDeleteNote(note._id)}
                    title="Delete note"
                  >
                    ×
                  </button>
                </div>
              </div>

              <h2>{note.title}</h2>

<div
  className="note-card-content"
  dangerouslySetInnerHTML={{ __html: note.content }}
/>
{note.tags && note.tags.length > 0 && (
  <div className="note-tags">
    {note.tags.map((tag) => (
      <span className="note-tag" key={tag}>
        #{tag}
      </span>
    ))}
  </div>
)}

              <div className="note-card-footer">
                <span>
                  {new Date(note.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {editingNote && (
        <div className="modal-overlay">
          <div className="note-editor-modal rich-note-editor-modal">
            <div className="modal-header">
              <div>
                <p className="eyebrow">EDIT NOTE</p>
                <h2>Edit your note</h2>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={() => setEditingNote(null)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateNote}>
  <div className="form-group">
    <label htmlFor="edit-note-title">
      Title
    </label>

    <input
      id="edit-note-title"
      type="text"
      value={editingNote.title}
      onChange={(event) =>
        setEditingNote({
          ...editingNote,
          title: event.target.value,
        })
      }
      required
    />
  </div>
  <div className="form-group">
  <label htmlFor="edit-note-tags">Tags</label>

  <input
    id="edit-note-tags"
    type="text"
    placeholder="e.g. college, project, javascript"
    value={(editingNote.tags || []).join(", ")}
    onChange={(event) =>
      setEditingNote({
        ...editingNote,
        tags: event.target.value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      })
    }
  />

  <small className="field-hint">
    Separate multiple tags with commas.
  </small>
</div>

  <div className="form-group">
    <label>Content</label>

    <RichTextEditor
      content={editingNote.content}
      onChange={(updatedContent) =>
        setEditingNote({
          ...editingNote,
          content: updatedContent,
        })
      }
    />
  </div>

  <div className="modal-actions">
    <button
      type="button"
      className="cancel-button"
      onClick={() => setEditingNote(null)}
    >
      Cancel
    </button>

    <button
      type="submit"
      className="save-button"
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

export default NotesPage;