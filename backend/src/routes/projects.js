const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createProject, getAllProjects, updateProject, deleteProject } = require("../controllers/projectsController");

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", getAllProjects);
router.patch("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
