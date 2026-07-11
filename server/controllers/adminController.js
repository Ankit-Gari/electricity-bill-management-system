const asyncHandler = require("express-async-handler");
const db = require("../config/db");

// Admin Dashboard Summary
const getAdminDashboardData = asyncHandler(async (req, res) => {
  try {
    console.log("🔁 Dashboard API called");

    const [users] = await db.query(
      "SELECT COUNT(*) AS totalCustomers FROM user_login"
    );
    console.log("✅ Total Customers:", users[0]);

    const [bills] = await db.query(
      "SELECT COUNT(*) AS unpaidBills FROM bills WHERE status = 'unpaid'"
    );
    console.log("✅ Unpaid Bills:", bills[0]);

    const [complaints] = await db.query(
      "SELECT COUNT(*) AS activeComplaints FROM inbox_admin WHERE status = 'pending'"
    );
    console.log("✅ Active Complaints:", complaints[0]);

    const [recentBills] = await db.query(`
      SELECT b.amt_topay AS amount, b.due_date, b.c_id, cd.name AS customer_name
      FROM bills b
      JOIN customer_details cd ON b.c_id = cd.c_id
      ORDER BY b.due_date DESC
      LIMIT 3
    `);
    console.log("✅ Recent Bills:", recentBills);

    const [recentComplaints] = await db.query(`
      SELECT ia.message AS complaint, ia.status, ia.timestamp, cd.name AS customer_name
      FROM inbox_admin ia
      JOIN customer_details cd ON ia.c_id = cd.c_id
      ORDER BY ia.timestamp DESC
      LIMIT 3
    `);
    console.log("✅ Recent Complaints:", recentComplaints);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers: users[0].totalCustomers,
        unpaidBills: bills[0].unpaidBills,
        activeComplaints: complaints[0].activeComplaints,
        recentBills: recentBills.map((b) => ({
          name: b.customer_name,
          amount: b.amount,
          due_date: b.due_date,
          c_id: b.c_id,
        })),
        recentComplaints: recentComplaints.map((c) => ({
          name: c.customer_name,
          complaint: c.complaint,
          status: c.status,
          timestamp: c.timestamp,
        })),
      },
    });
  } catch (err) {
    console.error("❌ Dashboard error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
  const [users] = await db.query("SELECT * FROM user_login");
  res.status(200).json({ success: true, data: users });
});

// Get Inbox Messages
const getAdminMessages = asyncHandler(async (req, res) => {
  const [messages] = await db.query("SELECT * FROM inbox_admin");
  res.status(200).json({ success: true, data: messages });
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM user_login WHERE c_id = ?", [id]);
  res.status(200).json({ success: true, message: "User deleted successfully" });
});

// Admin Stats Dashboard
const getAdminStats = asyncHandler(async (req, res) => {
  try {
    const [[{ totalRevenue }]] = await db.query(
      `SELECT SUM(bill_amt) AS totalRevenue FROM bills_paid`
    );

    const [[{ totalBills }]] = await db.query(
      `SELECT COUNT(*) AS totalBills FROM bills`
    );

    const [[{ paidBills }]] = await db.query(
      `SELECT COUNT(*) AS paidBills FROM bills WHERE status = 'paid'`
    );

    const [[{ unpaidBills }]] = await db.query(
      `SELECT COUNT(*) AS unpaidBills FROM bills WHERE status = 'unpaid'`
    );

    const [topCustomers] = await db.query(
      `SELECT name, SUM(bill_amt) AS total
       FROM bills_paid
       GROUP BY name
       ORDER BY total DESC
       LIMIT 5`
    );

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalBills,
        paidBills,
        unpaidBills,
        topCustomers
      }
    });
  } catch (err) {
    console.error("❌ Admin Stats Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = {
  getAdminDashboardData,
  getAllUsers,
  getAdminMessages,
  deleteUser,
  getAdminStats
};
