// Development helper: resets every account to a known password, stored as a
// bcrypt hash. Run with `npm run seed:passwords` after loading schema.sql.
//   customers -> user123
//   admins    -> admin123
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config();

(async () => {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    });

    const userHash = await bcrypt.hash("user123", 10);
    const adminHash = await bcrypt.hash("admin123", 10);

    const [userResult] = await db.query(
      "UPDATE user_login SET password = ?",
      [userHash]
    );
    console.log(`Updated user_login passwords: ${userResult.affectedRows} rows`);

    const [adminResult] = await db.query(
      "UPDATE admin_login SET password = ?",
      [adminHash]
    );
    console.log(`Updated admin_login passwords: ${adminResult.affectedRows} rows`);

    await db.end();
  } catch (err) {
    console.error("Error updating passwords:", err.message);
    process.exit(1);
  }
})();
