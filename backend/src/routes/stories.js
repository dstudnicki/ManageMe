const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createStory, getAllStories, getProjectsByUser, deleteStory } = require("../controllers/storyController");

const router = express.Router();

router.post("/", authMiddleware, createStory);
router.get("/", getAllStories);
router.get("/user/:userId", getProjectsByUser);
router.delete("/:id", authMiddleware, deleteStory);

module.exports = router;
