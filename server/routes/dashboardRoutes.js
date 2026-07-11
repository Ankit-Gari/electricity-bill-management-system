const express = require("express");
const router = express.Router();
const { getAdminDashboardStats } = require("../controllers/dashboardController");

router.get("/admin/dashboard", getAdminDashboardStats);

module.exports = router;
