const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// USER LOGIN
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const [userRows] = await db.query(
    "SELECT * FROM user_login WHERE name = ?",
    [username]
  );

  if (userRows.length === 0) {
    res.status(401);
    throw new Error("Invalid username or password");
  }

  const user = userRows[0];

  const isMatch = password === user.password;
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid username or password");
  }

  const token = jwt.sign({ id: user.c_id, username: user.name }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({ token });
});

// ADMIN LOGIN
const adminLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const [adminRows] = await db.query(
    "SELECT * FROM admin_login WHERE name = ?",
    [username]
  );

  if (adminRows.length === 0 || adminRows[0].password !== password) {
    res.status(401);
    throw new Error("Invalid admin credentials");
  }

  const token = jwt.sign({ id: adminRows[0].id, username: adminRows[0].name, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({ token });
});

// ✅ Correct export
module.exports = {
  loginUser,
  adminLogin
};
