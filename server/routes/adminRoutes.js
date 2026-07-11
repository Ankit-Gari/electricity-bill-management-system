const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");

const {
  getAdminDashboardData,
  getAllUsers,
  getAdminMessages,
  deleteUser,
  getAdminStats // ✅ Import admin stats controller
} = require("../controllers/adminController");

// 🧠 Admin Dashboard Summary
router.get("/dashboard", verifyToken, isAdmin, getAdminDashboardData);

// 👥 Get all registered users
router.get("/users", verifyToken, isAdmin, getAllUsers);

// 📩 Get all inbox messages
router.get("/messages", verifyToken, isAdmin, getAdminMessages);

// ❌ Delete a user by ID
router.delete("/user/:id", verifyToken, isAdmin, deleteUser);

// 📊 Admin Stats Route
router.get("/stats", verifyToken, isAdmin, getAdminStats); // ✅ Route added

module.exports = router;
