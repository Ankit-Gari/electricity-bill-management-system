// Seeds the database with realistic sample data for Delhi's North District:
// ~100 customers, 2-4 bills each over recent months, matching payment records,
// and ~15 complaints (mix of pending and resolved-with-reply).
//
// Deterministic: a seeded PRNG means reruns produce the same dataset.
// Wipes existing rows first. Run with: npm run seed
//
// Login after seeding: any customer username / user123, or admin / admin123.
const { Client } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// --- Deterministic PRNG (mulberry32) ---------------------------------------
let prngState = 20260711;
function rand() {
  prngState |= 0;
  prngState = (prngState + 0x6d2b79f5) | 0;
  let t = Math.imul(prngState ^ (prngState >>> 15), 1 | prngState);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const randInt = (min, max) => min + Math.floor(rand() * (max - min + 1));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

// --- Delhi North District sample data ---------------------------------------
const FIRST_NAMES = [
  "Rajesh", "Priya", "Amit", "Sunita", "Vikram", "Neha", "Arjun", "Kavita",
  "Suresh", "Anjali", "Manoj", "Pooja", "Rahul", "Deepika", "Sanjay", "Ritu",
  "Anil", "Shweta", "Ramesh", "Meena", "Vivek", "Nisha", "Ashok", "Rekha",
  "Rohit", "Seema", "Naveen", "Geeta", "Harish", "Anita", "Dinesh", "Shalini",
  "Mukesh", "Vandana", "Pankaj", "Sarita", "Yogesh", "Kiran", "Gaurav", "Usha",
];
const LAST_NAMES = [
  "Sharma", "Gupta", "Singh", "Verma", "Agarwal", "Jain", "Kumar", "Mishra",
  "Chauhan", "Yadav", "Malhotra", "Kapoor", "Arora", "Bhatia", "Saxena",
  "Tyagi", "Rastogi", "Goel", "Bansal", "Khanna",
];
const LOCALITIES = [
  "Model Town", "Civil Lines", "Kamla Nagar", "GTB Nagar", "Mukherjee Nagar",
  "Shakti Nagar", "Roop Nagar", "Burari", "Narela", "Alipur",
  "Wazirabad", "Timarpur", "Gulabi Bagh", "Sant Nagar",
];
const EMAIL_DOMAINS = ["gmail.com", "yahoo.in", "outlook.com", "rediffmail.com"];
const PAYMENT_METHODS = ["Card", "UPI", "Net Banking"];

const COMPLAINTS = [
  { subject: "[outage] Frequent power cuts in Burari", message: "We are facing 3-4 hour power cuts daily in Burari for the past week. This is affecting my children's studies and work from home. Please restore regular supply urgently." },
  { subject: "[billing] Bill amount much higher than usual", message: "My latest bill is almost double my average monthly bill even though our usage has not changed. Please check if the meter reading was recorded correctly." },
  { subject: "[meter] Meter running fast", message: "I suspect my electricity meter in Kamla Nagar is running faster than actual consumption. Requesting a meter accuracy test at the earliest." },
  { subject: "[connection] Voltage fluctuation in Model Town", message: "Severe voltage fluctuations in our lane in Model Town have damaged a refrigerator and two fans. Please check the local distribution transformer." },
  { subject: "[outage] Transformer sparking near GTB Nagar market", message: "The transformer near the GTB Nagar market has been sparking since yesterday evening. It is a safety hazard for shopkeepers and pedestrians. Please send a maintenance team." },
  { subject: "[billing] Wrong name printed on bill", message: "My electricity bill shows the previous owner's name even though I submitted the ownership transfer documents two months ago. Kindly update the records." },
  { subject: "[meter] Meter reading not taken this month", message: "The meter reader did not visit our house in Civil Lines this month and the bill was generated on an average basis. Please arrange an actual reading." },
  { subject: "[connection] New connection pending for 3 weeks", message: "I applied for a new domestic connection in Narela three weeks ago. The application status still shows pending. Please expedite." },
  { subject: "[outage] Street light pole wire hanging loose", message: "A live wire is hanging loose from the street light pole outside our block in Mukherjee Nagar. It rained yesterday and this is extremely dangerous." },
  { subject: "[billing] Payment made but bill shows unpaid", message: "I paid my bill through UPI last week and have the transaction receipt, but the portal still shows the bill as unpaid. Please reconcile the payment." },
  { subject: "[connection] Load increase request", message: "We have installed an air conditioner and need our sanctioned load increased from 3kW to 5kW at our Shakti Nagar residence. Please advise on the process." },
  { subject: "[outage] No power since morning in Alipur", message: "Our entire lane in Alipur has had no electricity since 6 AM. The helpline says the fault is logged but nobody has come yet. Water pumps are not working." },
  { subject: "[meter] Burnt smell from meter box", message: "There is a burning smell coming from the shared meter box in our building in Roop Nagar. Two meters look charred. Please inspect immediately." },
  { subject: "[billing] Subsidy not applied to bill", message: "My monthly consumption is under 200 units but the government subsidy has not been applied to my last two bills. Please check my subsidy registration." },
  { subject: "[connection] Shifting of meter connection", message: "We are moving from Timarpur to Sant Nagar next month and want to transfer our existing connection to the new address. What documents are required?" },
];

const REPLIES = [
  "Our maintenance team inspected the area and the fault has been rectified. Supply should be stable now. Please write back if the issue recurs.",
  "We have verified the meter reading against the photo log and issued a revised bill. The corrected amount will reflect in your account within 48 hours.",
  "A meter testing appointment has been scheduled. Our technician will visit within 3 working days between 10 AM and 5 PM.",
  "The local transformer load has been rebalanced and voltage levels are now within limits. Compensation claims for damaged appliances can be filed at the zonal office.",
  "The safety hazard was attended to on priority and the equipment has been replaced. Thank you for reporting it.",
  "Your records have been updated as requested. The change will appear from the next billing cycle.",
  "Your payment has been reconciled and the bill now shows as paid. We apologize for the inconvenience.",
];

async function main() {
  const db = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
  });
  await db.connect();

  const userHash = await bcrypt.hash("user123", 10);
  const adminHash = await bcrypt.hash("admin123", 10);

  console.log("Wiping existing data...");
  await db.query(
    "TRUNCATE inbox_user, inbox_admin, bills_paid, bills, customer_details, user_login, admin_login RESTART IDENTITY CASCADE"
  );

  // --- Admin -----------------------------------------------------------------
  await db.query("INSERT INTO admin_login (name, password) VALUES ($1, $2)", [
    "admin",
    adminHash,
  ]);

  // --- Customers ---------------------------------------------------------------
  console.log("Creating 100 customers across Delhi North District...");
  const customers = [];
  const usedUsernames = new Set();

  for (let i = 1; i <= 100; i++) {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    let username = `${first.toLowerCase()}.${last.toLowerCase()}`;
    while (usedUsernames.has(username)) {
      username = `${first.toLowerCase()}.${last.toLowerCase()}${randInt(1, 99)}`;
    }
    usedUsernames.add(username);

    const locality = pick(LOCALITIES);
    customers.push({
      c_id: i,
      username,
      name: `${first} ${last}`,
      email: `${username}@${pick(EMAIL_DOMAINS)}`,
      address: `${randInt(1, 250)}, ${locality}, North Delhi, Delhi - 1100${randInt(10, 99)}`,
    });
  }

  for (const c of customers) {
    await db.query(
      "INSERT INTO user_login (c_id, name, password) VALUES ($1, $2, $3)",
      [c.c_id, c.username, userHash]
    );
    await db.query(
      "INSERT INTO customer_details (c_id, name, email, address) VALUES ($1, $2, $3, $4)",
      [c.c_id, c.name, c.email, c.address]
    );
  }

  // --- Bills and payments ------------------------------------------------------
  console.log("Generating bills and payment history...");
  const today = new Date();
  let billCount = 0;
  let paymentCount = 0;

  for (const c of customers) {
    const numBills = randInt(2, 4);

    for (let m = numBills - 1; m >= 0; m--) {
      // One bill per month, newest month first in the loop's end state
      const units = randInt(80, 600); // typical Delhi household consumption
      const amount = (units * 8).toFixed(2); // ₹8 per unit
      const dueDate = new Date(today.getFullYear(), today.getMonth() - m, 15 + randInt(0, 10));

      // Older bills are almost always paid; the current month's is mostly unpaid
      const isPaid = m === 0 ? rand() < 0.3 : rand() < 0.9;

      const { rows: [bill] } = await db.query(
        "INSERT INTO bills (c_id, amt_topay, due_date, status) VALUES ($1, $2, $3, $4) RETURNING bill_id",
        [c.c_id, amount, dueDate, isPaid ? "paid" : "unpaid"]
      );
      billCount++;

      if (isPaid) {
        const paidDate = new Date(dueDate);
        paidDate.setDate(paidDate.getDate() - randInt(1, 12)); // paid before due date
        await db.query(
          "INSERT INTO bills_paid (c_id, name, bill_amt, method, bill_paid_date) VALUES ($1, $2, $3, $4, $5)",
          [c.c_id, c.name, amount, pick(PAYMENT_METHODS), paidDate]
        );
        paymentCount++;
      }
    }
  }

  // --- Complaints and admin replies ---------------------------------------------
  console.log("Filing complaints (7 resolved with replies, 8 pending)...");
  for (let i = 0; i < COMPLAINTS.length; i++) {
    const complaint = COMPLAINTS[i];
    const c = customers[randInt(0, customers.length - 1)];
    const resolved = i < 7; // first 7 resolved, remaining 8 pending
    const filedDaysAgo = resolved ? randInt(10, 45) : randInt(0, 9);
    const filedAt = new Date(today);
    filedAt.setDate(filedAt.getDate() - filedDaysAgo);
    filedAt.setHours(randInt(8, 20), randInt(0, 59), 0, 0);

    await db.query(
      `INSERT INTO inbox_admin (c_id, name, email, subject, message, status, replied, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [c.c_id, c.name, c.email, complaint.subject, complaint.message,
       resolved ? "resolved" : "pending", resolved, filedAt]
    );

    if (resolved) {
      const repliedAt = new Date(filedAt);
      repliedAt.setDate(repliedAt.getDate() + randInt(1, 5));
      await db.query(
        `INSERT INTO inbox_user (c_id, subject, message, is_read, timestamp)
         VALUES ($1, $2, $3, $4, $5)`,
        [c.c_id, `Re: ${complaint.subject}`, REPLIES[i % REPLIES.length], rand() < 0.5, repliedAt]
      );
    }
  }

  // Welcome notices for a handful of customers
  for (let i = 0; i < 10; i++) {
    const c = customers[randInt(0, customers.length - 1)];
    await db.query(
      "INSERT INTO inbox_user (c_id, subject, message, is_read) VALUES ($1, $2, $3, $4)",
      [c.c_id, "Welcome to the customer portal",
       "Welcome! You can view and pay your electricity bills, track payment history, and raise complaints here.",
       rand() < 0.5]
    );
  }

  // Explicit c_ids were inserted, so bump the identity sequence past them
  await db.query(
    "SELECT setval(pg_get_serial_sequence('user_login', 'c_id'), (SELECT MAX(c_id) FROM user_login))"
  );

  console.log(`Done: ${customers.length} customers, ${billCount} bills, ${paymentCount} payments, ${COMPLAINTS.length} complaints.`);
  console.log("Sample login -> customer: " + customers[0].username + " / user123, admin: admin / admin123");

  await db.end();
}

main().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
