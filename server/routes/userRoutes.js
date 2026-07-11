const express = require("express");
const router = express.Router();
const { getUserProfile, changePassword } = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/profile", verifyToken, getUserProfile);
router.post("/change-password", verifyToken, changePassword);

module.exports = router;
