const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createTask, getAllTasks, getProjectsByUser, deleteTask } = require("../controllers/taskController");

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", getAllTasks);
router.get("/user/:userId", getProjectsByUser);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
