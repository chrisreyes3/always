CREATE DATABASE WaterRefillingSystem;
USE WaterRefillingSystem;

CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_number VARCHAR(10) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    category ENUM('Residential', 'Government', 'Commercial', 'Industrial') NOT NULL,
    contact_person VARCHAR(100), -- Only used for Government, Commercial, and Industrial
    TIN_number VARCHAR(15),
    street VARCHAR(100),
    barangay VARCHAR(100),
    city VARCHAR(100),
    province VARCHAR(100),
    email_address VARCHAR(100),
    contact_number VARCHAR(15),
    price_per_bottle ENUM('30', '35', '40', '30/100') NOT NULL,
    status ENUM('Active', 'Non-Active') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    sale_date DATE NOT NULL,
    order_slip VARCHAR(10) NOT NULL,
    or_number VARCHAR(15),
    dr_number VARCHAR(15),
    qr_code VARCHAR(255),
    customer_id INT NOT NULL,
    price_per_bottle DECIMAL(10,2) NOT NULL,
    slim_bottles INT DEFAULT 0,
    round_bottles INT DEFAULT 0,
    other_items INT DEFAULT 0,
    cash_sales DECIMAL(10,2) AS (price_per_bottle * (slim_bottles + round_bottles + other_items)) STORED,
    account_receivable DECIMAL(10,2) DEFAULT 0,
    total_sales DECIMAL(10,2) AS (cash_sales + account_receivable) STORED,
    remarks VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

