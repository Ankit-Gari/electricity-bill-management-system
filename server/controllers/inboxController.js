const db = require("../config/db");
const asyncHandler = require("express-async-handler");

// Fetch inbox messages (admin replies) for the logged-in user
exports.getInbox = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { rows } = await db.query(
    "SELECT * FROM inbox_user WHERE c_id = $1 ORDER BY timestamp DESC",
    [id]
  );

  res.status(200).json({
    success: true,
    message: "Inbox fetched successfully",
    data: rows,
  });
});

// Mark an inbox message as read
exports.markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const messageId = req.params.id;

  await db.query(
    "UPDATE inbox_user SET is_read = TRUE WHERE id = $1 AND c_id = $2",
    [messageId, id]
  );

  res.status(200).json({ success: true, message: "Marked as read" });
});

// Submit a message/complaint to the admin inbox
exports.addMessage = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  const { id } = req.user;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  const { rows: user } = await db.query(
    "SELECT name, email FROM customer_details WHERE c_id = $1",
    [id]
  );

  if (!user.length) {
    return res
      .status(404)
      .json({ success: false, message: "User not found in customer_details" });
  }

  const { name, email } = user[0];

  await db.query(
    "INSERT INTO inbox_admin (c_id, name, email, subject, message) VALUES ($1, $2, $3, $4, $5)",
    [id, name, email, subject || "General", message]
  );

  res.status(201).json({
    success: true,
    message: "Message submitted successfully",
  });
});
