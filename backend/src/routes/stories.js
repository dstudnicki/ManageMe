const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createStory, getAllStories, getStoryById, updateStory, deleteStory } = require("../controllers/storyController");

const router = express.Router();

router.post("/", authMiddleware, createStory);
router.get("/", getAllStories);
router.get("/:id", getStoryById);
router.patch("/:id", authMiddleware, updateStory);
router.delete("/:id", authMiddleware, deleteStory);

module.exports = router;
