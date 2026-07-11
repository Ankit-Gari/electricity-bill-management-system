require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");

db.query("SELECT 1")
  .then(() => console.log("✅ MySQL connected successfully"))
  .catch(err => console.error("❌ MySQL connection failed:", err));

const authRoutes = require("./routes/authRoutes");
const inboxRoutes = require("./routes/inboxRoutes");
const userRoutes = require("./routes/userRoutes");
const billRoutes = require("./routes/billRoutes");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Public + Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Protected Routes
app.use("/api/user", userRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/inbox", inboxRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api", require("./routes/dashboardRoutes"));

app.use((req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
