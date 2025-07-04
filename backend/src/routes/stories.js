const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createStory, getAllStories, getStoryById, updateStory, deleteStory } = require("../controllers/storyController");

const router = express.Router();

router.post("/", authMiddleware, createStory);
router.get("/", getAllStories);
router.get("/:id", getStoryById);
router.patch("/:id", updateStory);
router.delete("/:id", deleteStory);

module.exports = router;
