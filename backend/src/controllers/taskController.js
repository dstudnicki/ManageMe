const Task = require("../models/Task");

const createTask = async (req, res) => {
    try {
        const { name, description, status, priority, story } = req.body;
        const task = await Task.create({
            name,
            description,
            status,
            priority,
            story,
            user: req.userId,
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: "Failed to create task", message: error.message });
    }
};

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate("user", "email").populate("story", "name");
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
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

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        if (task.user.toString() !== req.userId) {
            return res.status(403).json({ error: "Unauthorized to delete this task" });
        }

        await Task.deleteOne({ _id: task._id });
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Failed to delete task", message: error.message });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getProjectsByUser,
    deleteTask,
};
