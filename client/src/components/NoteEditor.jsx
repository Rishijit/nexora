import { useEffect, useState } from "react";
import RichTextEditor from "./RichTextEditor";
import API_URL from "../api";

function NoteEditor({ onClose }) {
  const DRAFT_KEY = "nexora_note_draft";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [draftStatus, setDraftStatus] = useState("");

  // =========================================
  // RECOVER SAVED DRAFT
  // =========================================

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);

    if (!savedDraft) {
      return;
    }

    try {
      const draft = JSON.parse(savedDraft);

      setTitle(draft.title || "");
      setContent(draft.content || "");
      setPinned(Boolean(draft.pinned));
      setTagsInput(draft.tagsInput || "");
      setDraftStatus("Draft recovered");
    } catch (error) {
      console.error(
        "Failed to recover note draft:",
        error
      );
    }
  }, []);

  // =========================================
  // AUTOSAVE DRAFT
  // =========================================

  useEffect(() => {
    const draft = {
      title,
      content,
      pinned,
      tagsInput,
    };

    const hasDraftContent =
      title.trim() ||
      (content && content !== "<p></p>") ||
      pinned ||
      tagsInput.trim();

    if (hasDraftContent) {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify(draft)
      );

      setDraftStatus("Draft saved ✓");
    }
  }, [title, content, pinned, tagsInput]);

  // =========================================
  // CREATE NOTE
  // =========================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      alert("Please enter a note title.");
      return;
    }

    if (
      !content.trim() ||
      content === "<p></p>"
    ) {
      alert("Please write something in the note.");
      return;
    }

    const tags = [
      ...new Set(
        tagsInput
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag.length > 0)
      ),
    ];

    try {
      setIsSaving(true);

      const token = localStorage.getItem("nexoraToken");

      const response = await fetch(
        `${API_URL}/api/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
            pinned,
            tags,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create note"
        );
      }

      // Remove the temporary draft after successful saving
      localStorage.removeItem(DRAFT_KEY);

      onClose();
    } catch (error) {
      console.error("Create note error:", error);
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  // =========================================
  // JSX
  // =========================================

  return (
    <div className="modal-overlay">
      <div className="note-editor-modal rich-note-editor-modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">NEW NOTE</p>
            <h2>Create a new note</h2>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="note-title">
              Title
            </label>

            <input
              id="note-title"
              type="text"
              placeholder="Enter note title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <div className="content-label-row">
              <label>Content</label>

              {draftStatus && (
                <span className="draft-status">
                  {draftStatus}
                </span>
              )}
            </div>

            <RichTextEditor
              content={content}
              onChange={setContent}
            />
          </div>

          <div className="form-group">
            <label htmlFor="note-tags">
              Tags
            </label>

            <input
              id="note-tags"
              type="text"
              placeholder="e.g. college, project, javascript"
              value={tagsInput}
              onChange={(event) =>
                setTagsInput(event.target.value)
              }
            />

            <small className="field-hint">
              Separate multiple tags with commas.
            </small>
          </div>

          <div className="pin-note-option">
            <input
              id="pin-new-note"
              type="checkbox"
              checked={pinned}
              onChange={(event) =>
                setPinned(event.target.checked)
              }
            />

            <label htmlFor="pin-new-note">
              Pin this note
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteEditor;