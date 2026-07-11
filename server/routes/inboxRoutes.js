const express = require("express");
const { getInbox, addMessage, markAsRead } = require("../controllers/inboxController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, getInbox);
router.post("/", verifyToken, addMessage);
router.patch("/:id/read", verifyToken, markAsRead);

module.exports = router;
