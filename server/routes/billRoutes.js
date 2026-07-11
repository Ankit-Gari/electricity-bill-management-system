const express = require("express");
const {
  getAllBills,
  getUserBills,
  addBill,
  deleteBill,
  getPaidBills, // ✅ add this
} = require("../controllers/billController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/bills - All bills
router.get("/", getAllBills);

// ✅ New Route for Paid Bills
router.get("/paid", verifyToken, getPaidBills);

// GET /api/bills/user - User's own bills
router.get("/user", verifyToken, getUserBills);

// POST /api/bills - Add a bill
router.post("/", verifyToken, addBill);

// POST /api/bills/pay - Mark bill as paid
router.post("/pay", verifyToken, async (req, res) => {
  const { bill_id, amount, name } = req.body;
  const { id } = req.user;

  try {
    await db.query(
      "INSERT INTO bills_paid (c_id, name, bill_amt, bill_paid_date) VALUES (?, ?, ?, NOW())",
      [id, name, amount]
    );
    await db.query("DELETE FROM bills WHERE bill_id = ?", [bill_id]);

    res.status(200).json({ success: true, message: "Bill paid successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
});

// DELETE /api/bills/:billId - Delete bill
router.delete("/:billId", verifyToken, deleteBill);

module.exports = router;
