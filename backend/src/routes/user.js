const express = require("express");
const { getAllUsers, getUserProfile, updateUserProfile, getUserProfileById } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile/me", authMiddleware, getUserProfile);
router.get("/id/:id", getUserProfileById);
router.get("/", getAllUsers);
router.get("/:username", getUserProfile);
router.put("/edit/:id", authMiddleware, updateUserProfile);

module.exports = router;
