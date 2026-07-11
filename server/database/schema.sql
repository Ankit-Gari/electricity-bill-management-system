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

-- Legacy customer table still used by the customer dashboard queries
CREATE TABLE IF NOT EXISTS customer (
  c_id      INT PRIMARY KEY,
  c_name    VARCHAR(100) NOT NULL
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
  id        INT AUTO_INCREMENT PRIMARY KEY,
  c_id      INT NOT NULL,
  name      VARCHAR(100),
  bill_amt  DECIMAL(10, 2) NOT NULL,
  bill_paid_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Legacy bill table still used by the customer dashboard queries
CREATE TABLE IF NOT EXISTS bill (
  bill_id   INT AUTO_INCREMENT PRIMARY KEY,
  c_id      INT NOT NULL,
  amount    DECIMAL(10, 2) NOT NULL,
  due_date  DATE,
  status    ENUM('paid', 'unpaid') DEFAULT 'unpaid'
);

-- ---------------------------------------------------------------------------
-- Complaints / messages
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS inbox_admin (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  c_id      INT NOT NULL,
  name      VARCHAR(100),
  email     VARCHAR(150),
  message   TEXT NOT NULL,
  status    ENUM('pending', 'resolved') DEFAULT 'pending',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Legacy complaint table still used by the customer dashboard queries
CREATE TABLE IF NOT EXISTS complaint (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  c_id      INT NOT NULL,
  complaint TEXT NOT NULL,
  status    ENUM('pending', 'resolved') DEFAULT 'pending',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

INSERT INTO customer (c_id, c_name) VALUES
  (1, 'John Smith'),
  (2, 'Sarah Johnson')
ON DUPLICATE KEY UPDATE c_name = VALUES(c_name);

INSERT INTO bills (c_id, amt_topay, due_date, status) VALUES
  (1, 1250.00, '2026-08-01', 'unpaid'),
  (2, 890.50, '2026-07-25', 'paid');

INSERT INTO bill (c_id, amount, due_date, status) VALUES
  (1, 1250.00, '2026-08-01', 'unpaid'),
  (2, 890.50, '2026-07-25', 'paid');

INSERT INTO bills_paid (c_id, name, bill_amt) VALUES
  (2, 'Sarah Johnson', 890.50);

INSERT INTO inbox_admin (c_id, name, email, message, status) VALUES
  (1, 'John Smith', 'john@example.com', 'Frequent power cuts in my area', 'pending');

INSERT INTO complaint (c_id, complaint, status) VALUES
  (1, 'Frequent power cuts in my area', 'pending');
