const express = require("express");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all tasks belonging to the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userId,
    }).sort({
      completed: 1,
      dueDate: 1,
      createdAt: -1,
    });

    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

// Create a new task
router.post("/", protect, async (req, res) => {
  try {
    const {
  title,
  description,
  priority,
  label,
  dueDate,
} = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const task = await Task.create({
  title,
  description,
  priority,
  label,
  dueDate,
  user: req.userId,
});

    res.status(201).json(task);
  } catch (error) {
  console.error("CREATE TASK ERROR:", error);

  res.status(500).json({
    message: "Failed to create task",
    error: error.message,
  });
}
});

// Update a task
router.put("/:id", protect, async (req, res) => {
  try {
    const {
  title,
  description,
  priority,
  label,
  dueDate,
  completed,
} = req.body;
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      {
  title,
  description,
  priority,
  label,
  dueDate,
  completed,
},
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      message: "Failed to update task",
    });
  }
});

// Delete a task
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
    } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      message: "Failed to delete task",
    });
  }
});

module.exports = router;