const mysql = require("mysql2/promise");
require("dotenv").config();

(async () => {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Set plain text password for all users
    const [userResult] = await db.query(
      `UPDATE user_login SET password = 'user123'`
    );
    console.log(`✅ Updated user_login passwords: ${userResult.affectedRows} rows`);

    // Set plain text password for all admins
    const [adminResult] = await db.query(
      `UPDATE admin_login SET password = 'admin123'`
    );
    console.log(`✅ Updated admin_login passwords: ${adminResult.affectedRows} rows`);

    await db.end();
  } catch (err) {
    console.error("❌ Error updating passwords:", err.message);
  }
})();
