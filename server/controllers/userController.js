const db = require("../config/db");
const asyncHandler = require("express-async-handler");

exports.getUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const [rows] = await db.query(
    "SELECT c_id AS id, name AS username FROM user_login WHERE c_id = ?",
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
