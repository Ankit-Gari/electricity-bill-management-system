const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// USER LOGIN
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const { rows: userRows } = await db.query(
    "SELECT * FROM user_login WHERE name = $1",
    [username]
  );

  if (userRows.length === 0) {
    res.status(401);
    throw new Error("Invalid username or password");
  }

  const user = userRows[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid username or password");
  }

  const token = jwt.sign({ id: user.c_id, username: user.name }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({ token });
});

// ADMIN LOGIN
const adminLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const { rows: adminRows } = await db.query(
    "SELECT * FROM admin_login WHERE name = $1",
    [username]
  );

  const isMatch =
    adminRows.length > 0 &&
    (await bcrypt.compare(password, adminRows[0].password));

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid admin credentials");
  }

  const token = jwt.sign(
    { id: adminRows[0].id, username: adminRows[0].name, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({ token });
});

module.exports = {
  loginUser,
  adminLogin,
};
