Mini ERP + CRM Operations Portal

1. Project Overview

The Mini ERP + CRM Operations Portal is a full-stack web application fora small wholesale/distribution business. It covers authentication,role-based access, customer CRM, products, inventory, stock movements,sales challans, REST APIs, database management, and deploymentpreparation.

Required technology

Frontend: React, HTML, CSS, JavaScript

Backend: Node.js, Express.js

Database: MySQL

API style: REST APIs

Authentication: JWT

Version control: Git and GitHub

2. Objectives

Implement login with role-based access.

Manage customers and CRM follow-ups.

Manage products and inventory.

Record stock IN/OUT movements.

Create sales challans.

Automatically generate challan numbers.

Save challans as Draft, Confirmed, or Cancelled.

Reduce stock when a challan is confirmed.

Prevent negative stock.

Return proper errors for insufficient stock.

Store product snapshot data in challan items.

Provide validation, error handling, search/filtering, andappropriate HTTP status codes.

Provide a clean admin-style React interface.

3. Roles

The required roles are:

Admin

Sales

Warehouse

Accounts

JWT authentication is used for login and protected routes.

Development test credentials

Role        Email                     Password

Admin       admin@minierp.com       admin123Sales       sales@minierp.com       sales123Warehouse   warehouse@minierp.com   warehouse123Accounts    accounts@minierp.com    accounts123

These are development/demo credentials only.

4. Architecture

React Frontend
      |
      | HTTP / REST
      v
Node.js + Express
      |
      +-- JWT Authentication
      +-- Role Authorization
      +-- Controllers / Services
      |
      v
MySQL
      |
      +-- users
      +-- customers
      +-- products
      +-- stock_movements
      +-- challans
      +-- challan_items

5. Project Structure

mini-erp-crm/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.js
            └── customercontroller.js
│   │   ├── db/
│   │   │   └── schema.sql
            └── database.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── routes/
│   │   │   └── authRoutes.js
            └── CustomerRoutes.js
│   │   ├── services/
│   │   └── server.js
        └── test-db.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProtectedRoute.jsx
            └── RoleProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── CustomerDetails.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── StockMovement.jsx
│   │   │   └── Challans.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── package-lock.json
│
└── README.md

The structure can be extended with additional controllers, routes,services, and database modules as implementation continues.

6. Authentication

Login flow

Login page
   |
POST /api/auth/login
   |
Validate credentials
   |
Generate JWT
   |
Return token + user
   |
Store authentication state
   |
Dashboard

Protected React routes redirect unauthenticated users to /login.Backend middleware validates the JWT before protected API operations.

7. Customer CRM

Customer fields

Customer name

Mobile number

Email

Business name

GST number (optional)

Customer type

Address

Status

Follow-up date

Notes

Customer types

Retail

Wholesale

Distributor

Customer statuses

Lead

Active

Inactive

Features

Add customer

Edit customer

Search customer

View customer details

Add follow-up notes

8. Products and Inventory

Product fields

Product name

SKU/code

Category

Unit price

Current stock

Minimum stock alert quantity

Location/warehouse

Features

Add product

Edit product

Search products

Display stock

Display minimum stock

Identify low-stock products

Display location/warehouse

Low-stock logic:

current stock <= minimum stock

9. Stock Movement

Each stock movement records:

Product

Quantity changed

Movement type

Reason

Created by

Timestamp

Movement types:

IN
OUT

Example:

Product: Wireless Keyboard
Quantity: 10
Type: IN
Reason: New stock received
Created By: Admin

10. Sales Challans

A sales user should be able to:

Select a customer.

Add multiple products.

Add quantity for each product.

Generate a challan number automatically.

Save a challan as Draft or Confirmed.

Challan fields

Challan number

Customer

Products

Total quantity

Status

Created by

Created date

The implementation also supports subtotal, tax, discount, grand total,and notes.

Statuses

Draft
Confirmed
Cancelled

Product snapshot

challan_items stores:

Product ID

Product name

SKU

Quantity

Unit price

Amount

This preserves the product information used by the historical challaninstead of depending only on the current product record.

11. Challan Stock Logic

Create Draft
     |
Select customer + products + quantities
     |
Confirm
     |
Check stock
     |
     +-- insufficient --> API error; no negative stock
     |
     v
Reduce product stock
     |
Create OUT stock movement
     |
Save confirmed challan

The backend must guarantee:

requested quantity <= available stock

A confirmed challan must reduce stock. Stock must never become negative.Insufficient stock must result in a proper API error.

12. MySQL Database

Database:

mini_erp_crm

Core tables:

users
customers
products
stock_movements
challans
challan_items

users

Stores:

id

name

email

password

role

created_at

customers

Stores:

id

name

mobile

email

business_name

gst_number

customer_type

address

status

follow_up_date

notes

created_at

updated_at

products

Stores:

id

name

sku

category

unit_price

stock

min_stock

location

created_at

updated_at

stock_movements

Stores:

id

product_id

movement_type

quantity

reason

created_by

created_at

challans

Stores:

id

challan_number

customer_id

total_quantity

subtotal

tax

discount

grand_total

status

notes

created_by

created_at

updated_at

challan_items

Stores:

id

challan_id

product_id

product_name

sku

quantity

unit_price

amount

13. Database Setup

Create the database:

CREATE DATABASE mini_erp_crm;
USE mini_erp_crm;

The schema is stored at:

backend/src/db/schema.sql

From inside MySQL:

SOURCE C:/Users/user/Desktop/mini-erp-crm/backend/src/db/schema.sql;

Verify:

SHOW TABLES;

Expected tables:

users
customers
products
stock_movements
challans
challan_items

14. Environment Variables

Create backend/.env:

PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mini_erp_crm
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
JWT_SECRET=YOUR_JWT_SECRET

.gitignore should include:

.env
node_modules/

15. Local Setup

Prerequisites

Node.js

npm

MySQL Server

Git

Backend

cd backend
npm install
npm start

Backend:

https://mini-erp-crm-backend-x5gm.onrender.com

Frontend

https://mini-erp-crm-frontend-ehtf.onrender.com

cd frontend
npm install
npm run dev


16. Frontend Routes

/login
/dashboard
/customers
/customers/:id
/products
/inventory
/stock-movement
/challans

Protected routes require authentication.

17. Dashboard

The dashboard provides:

Total customers

Total products

Low-stock products

Recent challans

Low-stock product information

18. REST API Design

Authentication:

POST /api/auth/login

Customers:

GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PUT    /api/customers/:id
DELETE /api/customers/:id

Products:

GET    /api/products
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id

Stock:

GET  /api/stock-movements
POST /api/stock-movements

Challans:

GET  /api/challans
POST /api/challans
GET  /api/challans/:id
PUT  /api/challans/:id

The final paths should match the routes actually implemented in thebackend.

19. Validation and Error Handling

The API should validate:

Required fields

Email format

Positive quantities

Existing customers

Existing products

Sufficient stock

Duplicate SKUs/challan numbers

Typical HTTP statuses:

200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error

API errors should return clear messages without exposing internalsecrets.

20. Postman

A Postman collection should be prepared with:

Mini ERP CRM API
├── Authentication
│   └── Login
├── Customers
│   ├── Get Customers
│   ├── Create Customer
│   ├── Get Customer
│   ├── Update Customer
│   └── Delete Customer
├── Products
│   ├── Get Products
│   ├── Create Product
│   ├── Get Product
│   └── Update Product
├── Stock Movements
│   ├── Get Movements
│   └── Create Movement
└── Challans
    ├── Get Challans
    ├── Create Challan
    ├── Get Challan
    └── Update Challan

Protected requests use:

Authorization: Bearer <JWT_TOKEN>

21. GitHub Commits

Configure cloud database SSL
Complete customer CRUD APIs
Implement JWT authentication and role based access
Complete challan module
Complete product and inventory module
Complete customer CRM module
Complete customer management frontend
Set up Express backend server
Style dashboard and add statistics cards
Create dashboard page
Add login page and application navigation
Initial React frontend setup

22. Deployment

Frontend & Backend has been deployed in render.
Database Mysql is deployed in avion sql.

Production architecture:

React Frontend
      |
      v
Hosted Node/Express API
      |
      v
Hosted SQL Database

23. Production Environment Variables

Configure these in the hosting provider:

PORT=5000
DB_HOST=<HOST>
DB_PORT=<PORT>
DB_NAME=<DATABASE_NAME>
DB_USER=<DATABASE_USER>
DB_PASSWORD=<DATABASE_PASSWORD>
JWT_SECRET=<STRONG_SECRET>



27. Known Limitations



Full database-backed authentication

Complete role-specific permissions

Customer REST APIs

Product REST APIs

Stock movement APIs

Challan transaction/business logic

Postman collection

Production database

Frontend deployment

Backend deployment

Demo recording

Only mark a feature complete after testing it end-to-end.

28. Conclusion

The project demonstrates a practical full-stack ERP/CRM workflow:

Authentication
    ↓
Role-Based Access
    ↓
Customer CRM
    ↓
Products
    ↓
Inventory
    ↓
Stock Movements
    ↓
Sales Challans
    ↓
Stock Validation
    ↓
MySQL Database
    ↓
REST APIs
    ↓
React UI
    ↓
Deployment

The goal is to demonstrate full-stack development, database design, APIdevelopment, authentication, business logic, validation, frontendintegration, and deployment readiness rather than building a largeenterprise ERP.
