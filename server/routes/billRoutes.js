const express = require("express");
const {
  getAllBills,
  getUserBills,
  payBill,
  deleteBill,
  getPaidBills,
  getUserPaidBills,
} = require("../controllers/billController");
const verifyToken = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/bills - All bills (admin)
router.get("/", verifyToken, isAdmin, getAllBills);

// GET /api/bills/paid - All payments (admin)
router.get("/paid", verifyToken, isAdmin, getPaidBills);

// GET /api/bills/paid/user - Logged-in user's payment history
router.get("/paid/user", verifyToken, getUserPaidBills);

// GET /api/bills/user - Logged-in user's bills
router.get("/user", verifyToken, getUserBills);

// POST /api/bills/pay - Pay a bill
router.post("/pay", verifyToken, payBill);

// DELETE /api/bills/:billId - Delete a bill (admin)
router.delete("/:billId", verifyToken, isAdmin, deleteBill);

module.exports = router;
