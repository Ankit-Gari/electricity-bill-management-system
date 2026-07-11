const express = require("express");
const router = express.Router();

const { loginUser, adminLogin } = require("../controllers/authController");

router.post("/login", loginUser);
router.post("/admin-login", adminLogin);

module.exports = router;
