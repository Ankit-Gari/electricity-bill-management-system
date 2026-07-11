const db = require("../config/db");
const asyncHandler = require("express-async-handler");

// Get all bills (admin/public access)
exports.getAllBills = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM bills");
  res.status(200).json({ success: true, message: "All bills retrieved", data: rows });
});

// Get bills for logged-in user
exports.getUserBills = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const [rows] = await db.query("SELECT * FROM bills WHERE c_id = ?", [id]);
  res.status(200).json({ success: true, message: "User bills retrieved", data: rows });
});

// Add a new bill for logged-in user
exports.addBill = asyncHandler(async (req, res) => {
  const { amount, due_date } = req.body;
  const { id } = req.user;

  await db.query(
    "INSERT INTO bills (c_id, amt_topay, due_date) VALUES (?, ?, ?)",
    [id, amount, due_date]
  );

  res.status(201).json({ success: true, message: "Bill added successfully" });
});

// Delete a bill by ID
exports.deleteBill = asyncHandler(async (req, res) => {
  const { billId } = req.params;

  await db.query("DELETE FROM bills WHERE bill_id = ?", [billId]);
  res.status(200).json({ success: true, message: "Bill deleted successfully" });
});

// Get all paid bills (admin)
exports.getPaidBills = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM bills_paid");
  res.status(200).json({ success: true, data: rows });
});

