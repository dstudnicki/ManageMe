const Project = require("../models/Project");

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
        const projects = await Project.find().populate("user", "email").populate("email");
        res.status(200).json(projects);
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

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        if (project.user.toString() !== req.userId) {
            return res.status(403).json({ error: "Unauthorized to delete this post" });
        }

        await Project.deleteOne({ _id: project._id });
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error); // Log the error
        res.status(500).json({ error: "Failed to delete project", message: error.message });
    }
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectsByUser,
    deleteProject,
};
