const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask } = require("../controllers/taskController");

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.patch("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
