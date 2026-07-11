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
    "SELECT COUNT(*) AS unpaid FROM bills WHERE c_id = ? AND status = 'unpaid'",
    [customerId]
  );

  const [complaints] = await db.query(
    "SELECT COUNT(*) AS active FROM inbox_admin WHERE c_id = ? AND status = 'pending'",
    [customerId]
  );

  const [recentBills] = await db.query(
    `SELECT b.amt_topay AS amount, b.due_date, b.c_id, cd.name
     FROM bills b
     JOIN customer_details cd ON b.c_id = cd.c_id
     WHERE b.c_id = ?
     ORDER BY b.due_date DESC
     LIMIT 3`,
    [customerId]
  );

  const [recentComplaints] = await db.query(
    `SELECT ia.message AS complaint, ia.status, ia.timestamp, cd.name
     FROM inbox_admin ia
     JOIN customer_details cd ON ia.c_id = cd.c_id
     WHERE ia.c_id = ?
     ORDER BY ia.timestamp DESC
     LIMIT 3`,
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
