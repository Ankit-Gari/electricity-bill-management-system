const db = require("../config/db");
const asyncHandler = require("express-async-handler");

// Get all bills with customer names (admin)
exports.getAllBills = asyncHandler(async (req, res) => {
  const { rows } = await db.query(`
    SELECT b.bill_id, b.c_id, b.amt_topay, b.due_date, b.status, cd.name
    FROM bills b
    LEFT JOIN customer_details cd ON b.c_id = cd.c_id
    ORDER BY b.due_date DESC
  `);
  res.status(200).json({ success: true, message: "All bills retrieved", data: rows });
});

// Get bills for logged-in user
exports.getUserBills = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { rows } = await db.query(
    "SELECT * FROM bills WHERE c_id = $1 ORDER BY due_date DESC",
    [id]
  );
  res.status(200).json({ success: true, message: "User bills retrieved", data: rows });
});

// Pay a bill: record the payment and mark the bill paid
exports.payBill = asyncHandler(async (req, res) => {
  const { bill_id } = req.body;
  const { id } = req.user;

  const { rows: bills } = await db.query(
    "SELECT * FROM bills WHERE bill_id = $1 AND c_id = $2",
    [bill_id, id]
  );

  if (bills.length === 0) {
    return res.status(404).json({ success: false, message: "Bill not found" });
  }
  if (bills[0].status === "paid") {
    return res.status(400).json({ success: false, message: "Bill is already paid" });
  }

  const { rows: customer } = await db.query(
    "SELECT name FROM customer_details WHERE c_id = $1",
    [id]
  );
  const name = customer.length ? customer[0].name : req.user.username;

  await db.query(
    "INSERT INTO bills_paid (c_id, name, bill_amt, method, bill_paid_date) VALUES ($1, $2, $3, $4, NOW())",
    [id, name, bills[0].amt_topay, "Card"]
  );
  await db.query("UPDATE bills SET status = 'paid' WHERE bill_id = $1", [bill_id]);

  res.status(200).json({ success: true, message: "Bill paid successfully" });
});

// Delete a bill by ID
exports.deleteBill = asyncHandler(async (req, res) => {
  const { billId } = req.params;

  await db.query("DELETE FROM bills WHERE bill_id = $1", [billId]);
  res.status(200).json({ success: true, message: "Bill deleted successfully" });
});

// Get all paid bills (admin)
exports.getPaidBills = asyncHandler(async (req, res) => {
  const { rows } = await db.query(
    "SELECT * FROM bills_paid ORDER BY bill_paid_date DESC"
  );
  res.status(200).json({ success: true, data: rows });
});

// Get paid bills for the logged-in user
exports.getUserPaidBills = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { rows } = await db.query(
    "SELECT * FROM bills_paid WHERE c_id = $1 ORDER BY bill_paid_date DESC",
    [id]
  );
  res.status(200).json({ success: true, data: rows });
});
