const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createProject, getAllProjects, getProjectsByUser, deleteProject } = require("../controllers/projectsController");

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", getAllProjects);
router.get("/user/:userId", getProjectsByUser);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
