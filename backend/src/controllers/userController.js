const Project = require("../models/Project");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const { email } = req.params;

        let user;

        if (email) {
            user = await User.findOne({ email }).select("-password");
        } else {
            user = await User.findById(req.userId).select("-password");
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const projects = await Project.find({ user: user._id });

        res.status(200).json({ user, projects });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user profile", message: error.message });
    }
};

const getUserProfileById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user profile", message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { email, password } = req.body;

        const updateFields = {};
        if (email) updateFields.email = email;
        if (password) updateFields.password = await bcrypt.hash(password, 10);

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "No fields provided for update" });
        }

        const updateUser = await User.findByIdAndUpdate(userId, updateFields, { new: true, runValidators: true });

        if (!updateUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: updateUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile", message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserProfile,
    updateUserProfile,
    getUserProfileById,
};
