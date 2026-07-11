const db = require("../config/db");
const asyncHandler = require("express-async-handler");

// Fetch inbox messages for logged-in user
exports.getInbox = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const [rows] = await db.query("SELECT * FROM inbox_admin WHERE c_id = ?", [id]);

  res.status(200).json({
    success: true,
    message: "Inbox fetched successfully",
    data: rows,
  });
});

// Add message from user
exports.addMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const { id } = req.user;

  // Get user details from customer_details table
  const [user] = await db.query("SELECT name, email FROM customer_details WHERE c_id = ?", [id]);

  if (!user.length) {
    return res.status(404).json({ success: false, message: "User not found in customer_details" });
  }

  const { name, email } = user[0];

  await db.query(
    "INSERT INTO inbox_admin (c_id, name, email, message) VALUES (?, ?, ?, ?)",
    [id, name, email, message]
  );

  res.status(201).json({
    success: true,
    message: "Message added to inbox",
  });
});
