const express = require("express");
const { getInbox, addMessage } = require("../controllers/inboxController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, getInbox);
router.post("/", verifyToken, addMessage);

module.exports = router;
