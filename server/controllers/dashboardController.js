const db = require("../config/db");
const asyncHandler = require("express-async-handler");

const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const [[{ totalCustomers }]] = await db.query("SELECT COUNT(*) AS totalCustomers FROM customer");
  const [[{ unpaidBills }]] = await db.query("SELECT COUNT(*) AS unpaidBills FROM bill WHERE status = 'unpaid'");
  const [[{ activeComplaints }]] = await db.query("SELECT COUNT(*) AS activeComplaints FROM complaint WHERE status = 'pending'");

  const [recentBills] = await db.query(`
    SELECT c.name, b.amount, b.due_date, b.c_id 
    FROM bill b 
    JOIN customer c ON b.c_id = c.c_id 
    ORDER BY b.due_date ASC LIMIT 3
  `);

  const [recentComplaints] = await db.query(`
    SELECT c.name, co.complaint, co.status, co.timestamp 
    FROM complaint co 
    JOIN customer c ON co.c_id = c.c_id 
    ORDER BY co.timestamp DESC LIMIT 3
  `);

  res.json({
    totalCustomers,
    unpaidBills,
    activeComplaints,
    recentBills,
    recentComplaints,
  });
});

module.exports = { getAdminDashboardStats };
