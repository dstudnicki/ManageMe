const Task = require("../models/Task");

const createTask = async (req, res) => {
    try {
        const { name, description, status, priority, story, project } = req.body;
        const task = await Task.create({
            name,
            description,
            status,
            priority,
            story,
            project,
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

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        const tasks = await Task.findById(id);

        if (!tasks) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch desired task" });
    }
};

const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
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

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        if (task.user.toString() !== req.userId) {
            return res.status(403).json({ error: "Unauthorized to update this task" });
        }

        const updatedTask = await Task.findByIdAndUpdate(taskId, updateFields, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ error: "Failed to update task", message: error.message });
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
    getTaskById,
    updateTask,
    deleteTask,
};
