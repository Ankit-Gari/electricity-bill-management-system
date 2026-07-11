const db = require("../config/db");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

exports.getUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const { rows } = await db.query(
    "SELECT c_id AS id, name AS username FROM user_login WHERE c_id = $1",
    [id]
  );

  if (!rows.length) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: rows[0],
  });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Current and new password are required" });
  }
  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ success: false, message: "New password must be at least 8 characters" });
  }

  const { rows } = await db.query(
    "SELECT password FROM user_login WHERE c_id = $1",
    [id]
  );
  if (!rows.length) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Current password is incorrect" });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await db.query("UPDATE user_login SET password = $1 WHERE c_id = $2", [hash, id]);

  res.status(200).json({ success: true, message: "Password updated successfully" });
});
