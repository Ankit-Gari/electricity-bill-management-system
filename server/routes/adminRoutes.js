const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");

const {
  getAdminDashboardData,
  getAllUsers,
  getAdminMessages,
  updateMessageStatus,
  replyToMessage,
  createBill,
  deleteUser,
  getAdminStats,
} = require("../controllers/adminController");

// Dashboard summary
router.get("/dashboard", verifyToken, isAdmin, getAdminDashboardData);

// Customers
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.delete("/user/:id", verifyToken, isAdmin, deleteUser);

// Bills
router.post("/bills", verifyToken, isAdmin, createBill);

// Inbox / complaints
router.get("/messages", verifyToken, isAdmin, getAdminMessages);
router.patch("/messages/:id", verifyToken, isAdmin, updateMessageStatus);
router.post("/messages/:id/reply", verifyToken, isAdmin, replyToMessage);

// Stats
router.get("/stats", verifyToken, isAdmin, getAdminStats);

module.exports = router;
