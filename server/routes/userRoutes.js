const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware"); // ✅ correct

router.get("/profile", verifyToken, getUserProfile);

module.exports = router;
