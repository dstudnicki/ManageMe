const Story = require("../models/Story");

const createStory = async (req, res) => {
    try {
        const { name, description, status, priority, project } = req.body;
        const story = await Story.create({
            name,
            description,
            status,
            priority,
            project,
            user: req.userId,
        });
        res.status(201).json(story);
    } catch (error) {
        res.status(500).json({ error: "Failed to create story", message: error.message });
    }
};

const getAllStories = async (req, res) => {
    try {
        const stories = await Story.find().populate("user", "email").populate("project", "name");
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch projects" });
    }
};

const getProjectsByUser = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.params.userId }).populate("user", "email");
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch projects" });
    }
};

const deleteStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) {
            return res.status(404).json({ error: "Story not found" });
        }

        if (story.user.toString() !== req.userId) {
            return res.status(403).json({ error: "Unauthorized to delete this story" });
        }

        await Story.deleteOne({ _id: story._id });
        res.status(200).json({ message: "Story deleted successfully" });
    } catch (error) {
        console.error("Error deleting story:", error);
        res.status(500).json({ error: "Failed to delete story", message: error.message });
    }
};

module.exports = {
    createStory,
    getAllStories,
    getProjectsByUser,
    deleteStory,
};
