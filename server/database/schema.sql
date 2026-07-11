-- Electricity Bill Management — MySQL schema
-- Create the database, then load this file:
--   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS electricity"
--   mysql -u root -p electricity < server/database/schema.sql

-- ---------------------------------------------------------------------------
-- Auth
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_login (
  c_id      INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL            -- bcrypt hash
);

CREATE TABLE IF NOT EXISTS admin_login (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL            -- bcrypt hash
);

-- ---------------------------------------------------------------------------
-- Customers
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS customer_details (
  c_id      INT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  email     VARCHAR(150),
  FOREIGN KEY (c_id) REFERENCES user_login (c_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Bills
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bills (
  bill_id   INT AUTO_INCREMENT PRIMARY KEY,
  c_id      INT NOT NULL,
  amt_topay DECIMAL(10, 2) NOT NULL,
  due_date  DATE,
  status    ENUM('paid', 'unpaid') DEFAULT 'unpaid',
  FOREIGN KEY (c_id) REFERENCES user_login (c_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bills_paid (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  c_id           INT NOT NULL,
  name           VARCHAR(100),
  bill_amt       DECIMAL(10, 2) NOT NULL,
  method         VARCHAR(50) DEFAULT 'Card',
  bill_paid_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- Messaging
-- ---------------------------------------------------------------------------

-- Customer -> admin (complaints and queries)
CREATE TABLE IF NOT EXISTS inbox_admin (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  c_id      INT NOT NULL,
  name      VARCHAR(100),
  email     VARCHAR(150),
  subject   VARCHAR(200),
  message   TEXT NOT NULL,
  status    ENUM('pending', 'resolved') DEFAULT 'pending',
  replied   TINYINT(1) DEFAULT 0,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin -> customer (replies and notices)
CREATE TABLE IF NOT EXISTS inbox_user (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  c_id      INT NOT NULL,
  subject   VARCHAR(200),
  message   TEXT NOT NULL,
  is_read   TINYINT(1) DEFAULT 0,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (c_id) REFERENCES user_login (c_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Sample data (passwords are set by `npm run seed:passwords`)
-- ---------------------------------------------------------------------------

INSERT INTO user_login (c_id, name, password) VALUES
  (1, 'john', 'placeholder'),
  (2, 'sarah', 'placeholder')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO admin_login (id, name, password) VALUES
  (1, 'admin', 'placeholder')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO customer_details (c_id, name, email) VALUES
  (1, 'John Smith', 'john@example.com'),
  (2, 'Sarah Johnson', 'sarah@example.com')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO bills (c_id, amt_topay, due_date, status) VALUES
  (1, 1250.00, '2026-08-15', 'unpaid'),
  (1, 980.00, '2026-07-15', 'paid'),
  (2, 890.50, '2026-08-15', 'unpaid');

INSERT INTO bills_paid (c_id, name, bill_amt, method) VALUES
  (1, 'John Smith', 980.00, 'Card');

INSERT INTO inbox_admin (c_id, name, email, subject, message, status) VALUES
  (1, 'John Smith', 'john@example.com', 'Power Outage',
   'Frequent power cuts in my area for the past week. Please investigate.', 'pending');

INSERT INTO inbox_user (c_id, subject, message) VALUES
  (1, 'Welcome', 'Welcome to the Electricity Bill Management portal. You can view and pay bills, and raise complaints here.');
