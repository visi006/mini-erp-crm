CREATE DATABASE IF NOT EXISTS mini_erp_crm;

USE mini_erp_crm;

-- =========================================
-- USERS
-- =========================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Sales', 'Warehouse', 'Accounts') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- CUSTOMERS
-- =========================================

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    business_name VARCHAR(150),
    gst_number VARCHAR(50),
    customer_type ENUM('Retail', 'Wholesale', 'Distributor') NOT NULL,
    address TEXT,
    status ENUM('Lead', 'Active', 'Inactive') NOT NULL DEFAULT 'Active',
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_customer_name (name),
    INDEX idx_customer_mobile (mobile),
    INDEX idx_customer_status (status)
);


-- =========================================
-- PRODUCTS
-- =========================================

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100),
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 0,
    location VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_product_name (name),
    INDEX idx_product_category (category),
    INDEX idx_product_sku (sku)
);


-- =========================================
-- STOCK MOVEMENTS
-- =========================================

CREATE TABLE IF NOT EXISTS stock_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT NOT NULL,

    movement_type ENUM('IN', 'OUT') NOT NULL,

    quantity INT NOT NULL,

    reason VARCHAR(255),

    created_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stock_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_stock_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_stock_product (product_id),
    INDEX idx_stock_type (movement_type),
    INDEX idx_stock_created_at (created_at)
);


-- =========================================
-- CHALLANS
-- =========================================

CREATE TABLE IF NOT EXISTS challans (
    id INT AUTO_INCREMENT PRIMARY KEY,

    challan_number VARCHAR(50) NOT NULL UNIQUE,

    customer_id INT NOT NULL,

    total_quantity INT NOT NULL DEFAULT 0,

    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,

    tax DECIMAL(10,2) NOT NULL DEFAULT 0,

    discount DECIMAL(10,2) NOT NULL DEFAULT 0,

    grand_total DECIMAL(10,2) NOT NULL DEFAULT 0,

    status ENUM(
        'Draft',
        'Confirmed',
        'Cancelled'
    ) NOT NULL DEFAULT 'Draft',

    notes TEXT,

    created_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_challan_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_challan_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_challan_customer (customer_id),
    INDEX idx_challan_status (status),
    INDEX idx_challan_created_at (created_at)
);


-- =========================================
-- CHALLAN ITEMS
-- =========================================

CREATE TABLE IF NOT EXISTS challan_items (
    id INT AUTO_INCREMENT PRIMARY KEY,

    challan_id INT NOT NULL,

    product_id INT NOT NULL,

    -- Product snapshot
    product_name VARCHAR(150) NOT NULL,
    sku VARCHAR(100) NOT NULL,

    quantity INT NOT NULL,

    unit_price DECIMAL(10,2) NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_item_challan
        FOREIGN KEY (challan_id)
        REFERENCES challans(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_item_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_item_challan (challan_id),
    INDEX idx_item_product (product_id)
);