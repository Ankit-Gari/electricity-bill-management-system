const asyncHandler = require("express-async-handler");
const db = require("../config/db");

// GET Customer Dashboard Data
const getCustomerDashboardData = asyncHandler(async (req, res) => {
  const customerId = req.user?.id;

  if (!customerId) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const [unpaidBills] = await db.query(
    "SELECT COUNT(*) AS unpaid FROM bill WHERE c_id = ? AND status = 'unpaid'",
    [customerId]
  );

  const [complaints] = await db.query(
    "SELECT COUNT(*) AS active FROM complaint WHERE c_id = ? AND status = 'pending'",
    [customerId]
  );

  const [recentBills] = await db.query(
    "SELECT amount, due_date, c_id, c_name AS name FROM bill NATURAL JOIN customer WHERE c_id = ? ORDER BY due_date DESC LIMIT 3",
    [customerId]
  );

  const [recentComplaints] = await db.query(
    "SELECT complaint, status, timestamp, c_name AS name FROM complaint NATURAL JOIN customer WHERE c_id = ? ORDER BY timestamp DESC LIMIT 3",
    [customerId]
  );

  res.json({
    unpaidBills: unpaidBills[0].unpaid,
    activeComplaints: complaints[0].active,
    recentBills,
    recentComplaints,
  });
});

module.exports = { getCustomerDashboardData };
