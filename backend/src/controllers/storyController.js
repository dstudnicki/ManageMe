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

const getStoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const stories = await Story.findById(id);

        if (!stories) {
            return res.status(404).json({ error: "Story not found" });
        }
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch desired story" });
    }
};

const updateStory = async (req, res) => {
    try {
        const storyId = req.params.id;
        const { name, description, priority, status, user } = req.body;

        const updateFields = {};
        if (name) updateFields.name = name;
        if (description) updateFields.description = description;
        if (priority) updateFields.priority = priority;
        if (status) updateFields.status = status;
        if (user) updateFields.user = user;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "No fields provided for update" });
        }

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ error: "Story not found" });
        }

        if (story.user.toString() !== req.userId) {
            return res.status(403).json({ error: "Unauthorized to update this story" });
        }

        const updatedStory = await Story.findByIdAndUpdate(storyId, updateFields, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ message: "Story updated successfully", story: updatedStory });
    } catch (error) {
        res.status(500).json({ error: "Failed to update story", message: error.message });
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
    getStoryById,
    updateStory,
    deleteStory,
};
