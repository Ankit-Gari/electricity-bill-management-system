const express = require("express");
const router = express.Router(); 
const { getCustomerDashboardData } = require("../controllers/customerController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/dashboard", verifyToken, getCustomerDashboardData);

module.exports = router;
