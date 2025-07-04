const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createProject, getAllProjects, updateProject, deleteProject } = require("../controllers/projectsController");

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", getAllProjects);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
