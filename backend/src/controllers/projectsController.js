const Project = require("../models/Project");
const Task = require("../models/Task");
const UserStory = require("../models/Story");

const createProject = async (req, res) => {
    try {
        const { name, title, status, priority } = req.body;
        const project = await Project.create({
            name,
            title,
            status,
            priority,
            user: req.userId,
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: "Failed to deploy project", message: error.message });
    }
};

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate("user", "email");
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch projects" });
    }
};

const updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { name, title, priority, status, user } = req.body;

        const updateFields = {};
        if (name) updateFields.name = name;
        if (title) updateFields.title = title;
        if (priority) updateFields.priority = priority;
        if (status) updateFields.status = status;
        if (user) updateFields.user = user;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "No fields provided for update" });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const updatedProject = await Project.findByIdAndUpdate(projectId, updateFields, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ message: "Project updated successfully", project: updatedProject });
    } catch (error) {
        res.status(500).json({ error: "Failed to update project", message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        // Delete user stories related to this project
        await UserStory.deleteMany({ project: project._id });

        // Delete tasks related to this project
        await Task.deleteMany({ project: project._id });

        // Now delete the project itself
        await Project.deleteOne({ _id: project._id });

        res.status(200).json({ message: "Project and related data deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Failed to delete project", message: error.message });
    }
};

module.exports = {
    createProject,
    getAllProjects,
    updateProject,
    deleteProject,
};
