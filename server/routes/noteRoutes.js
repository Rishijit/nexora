const express = require("express");
const Note = require("../models/Note");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return [
    ...new Set(
      tags
        .map((tag) => String(tag).trim().toLowerCase())
        .filter((tag) => tag.length > 0)
    ),
  ];
}
// Get all notes belonging to the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.userId,
    }).sort({
      pinned: -1,
      createdAt: -1,
    });

    res.json(notes);
  } catch (error) {
    console.error("Get notes error:", error);

    res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
});

// Create a new note
router.post("/", protect, async (req, res) => {
  try {
    const { title, content, pinned, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

  const note = await Note.create({
  title,
  content,
  pinned: Boolean(pinned),
  tags: normalizeTags(tags),
  user: req.userId,
});

    res.status(201).json(note);
  } catch (error) {
    console.error("Create note error:", error);

    res.status(500).json({
      message: "Failed to create note",
    });
  }
});

// Update a note
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, content, pinned, tags } = req.body;

    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      {
  title,
  content,
  pinned,
  tags: normalizeTags(tags),
},
      {
        new: true,
        runValidators: true,
      }
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(note);
  } catch (error) {
    console.error("Update note error:", error);

    res.status(500).json({
      message: "Failed to update note",
    });
  }
});

// Delete a note
router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    res.status(500).json({
      message: "Failed to delete note",
    });
  }
});

module.exports = router;