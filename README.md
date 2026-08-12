🚀 Mini ERP + CRM Operations Portal

<p align="center">
  <b>A full-stack ERP + CRM solution for wholesale and distribution operations</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/API-REST-02569B?style=for-the-badge" alt="REST"/>
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge" alt="JWT"/>
  <img src="https://img.shields.io/badge/Deployment-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render"/>
</p>

<p align="center">
  <i>Customer management • Inventory • Stock tracking • Sales challans • Role-based access</i>
</p>

📌 Overview

Mini ERP + CRM Operations Portal is a full-stack web application built for a small wholesale/distribution business.

The application brings together customer CRM, product and inventory management, stock movements, sales challans, authentication, role-based access, REST APIs, and a MySQL database in one admin-style portal.

🎯 What this project demonstrates

🔐 JWT-based authentication

👥 Role-based access

🧑‍💼 Customer CRM

📦 Product & inventory management

🔄 Stock IN/OUT tracking

🧾 Sales challan management

🛡️ Stock validation and negative-stock protection

🗄️ MySQL database design

🔌 REST API architecture

🌐 Frontend + backend deployment

🧰 Tech Stack

Layer

Technology

🎨 Frontend

React, HTML, CSS, JavaScript

⚙️ Backend

Node.js, Express.js

🗄️ Database

MySQL

🔐 Authentication

JWT

🔌 API

REST APIs

🌍 Frontend Hosting

Render

☁️ Backend Hosting

Render

🛠️ Version Control

Git & GitHub

🏗️ System Architecture

                    ┌─────────────────────┐
                    │    React Frontend   │
                    │   Admin-style UI    │
                    └──────────┬──────────┘
                               │
                         HTTP / REST
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Node.js + Express │
                    │                     │
                    │  JWT Authentication │
                    │  Role Authorization │
                    │  REST APIs          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       MySQL         │
                    │                     │
                    │ users               │
                    │ customers           │
                    │ products            │
                    │ stock_movements     │
                    │ challans            │
                    │ challan_items       │
                    └─────────────────────┘

✨ Core Modules

🔐 1. Authentication & Roles

The application supports four required roles:

Role

Purpose

👑 Admin

Full system administration

💼 Sales

Customer & sales operations

🏭 Warehouse

Inventory & stock operations

💰 Accounts

Accounts-related operations

Login Flow

Login Page
    ↓
POST /api/auth/login
    ↓
Validate Credentials
    ↓
Generate JWT
    ↓
Return Token + User
    ↓
Protected Application

Unauthenticated users are redirected to /login, while backend middleware validates JWT tokens before protected operations.

👥 2. Customer CRM

Customer Information

Customer name

Mobile number

Email

Business name

GST number

Customer type

Address

Status

Follow-up date

Notes

Customer Types

Retail • Wholesale • Distributor

Customer Status

Lead • Active • Inactive

Features

➕ Add customer

✏️ Edit customer

🔎 Search customer

👁️ View customer details

📝 Add follow-up notes

📦 3. Product & Inventory

Product Information

Product name

SKU / code

Category

Unit price

Current stock

Minimum stock level

Warehouse/location

Features

➕ Add product

✏️ Edit product

🔎 Search products

📊 View stock

⚠️ Identify low-stock products

📍 Track warehouse/location

Low Stock Rule

Current Stock <= Minimum Stock
             ↓
        LOW STOCK

🔄 4. Stock Movement

Every inventory movement records:

Field

Description

Product

Product affected

Quantity

Quantity changed

Type

IN or OUT

Reason

Reason for movement

Created By

User responsible

Timestamp

Date/time of movement

Example:

Product      : Wireless Keyboard
Quantity     : 10
Movement     : IN
Reason       : New stock received
Created By   : Admin

🧾 5. Sales Challans

The Sales Challan module supports the complete sales flow.

Features

Select customer

Add multiple products

Enter quantities

Automatically generate challan number

Save as Draft

Confirm challan

Cancel challan

View complete challan details

Calculate totals

Challan Status

📝 Draft
✅ Confirmed
❌ Cancelled

Challan Information

Challan number

Customer

Products

Total quantity

Subtotal

Tax

Discount

Grand total

Status

Created by

Created date

Notes

🧠 Important Business Logic

Confirmed Challan → Stock Reduction

The application validates inventory before confirming a challan.

Create Draft
     │
     ▼
Select Customer + Products
     │
     ▼
Enter Quantities
     │
     ▼
Confirm Challan
     │
     ▼
Check Available Stock
     │
     ├───────────────┐
     │               │
     ▼               ▼
 Sufficient       Insufficient
   Stock             Stock
     │               │
     ▼               ▼
Reduce Stock      Return API Error
     │               │
     ▼               ▼
Create OUT       No Stock Change
Movement
     │
     ▼
Save Confirmed Challan

Stock Protection

The system guarantees:

Requested Quantity <= Available Stock

Therefore:

❌ Stock cannot become negative.

❌ Insufficient stock cannot be confirmed.

✅ Confirmed challans reduce stock.

✅ OUT stock movements can be recorded.

✅ Challan items preserve product snapshot information.

🗄️ Database Design

Database:

mini_erp_crm

Core Tables

users
customers
products
stock_movements
challans
challan_items

Relationships

Users
 ├── Stock Movements
 └── Challans

Customers
 └── Challans
       └── Challan Items
              └── Products

Products
 ├── Stock Movements
 └── Challan Items

Product Snapshot

challan_items stores:

Product ID

Product name

SKU

Quantity

Unit price

Amount

This preserves historical challan information even if the current product record changes later.

📁 Project Structure

mini-erp-crm/
│
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 controllers/
│   │   │   ├── authController.js
│   │   │   └── customercontroller.js
│   │   │
│   │   ├── 📁 db/
│   │   │   ├── schema.sql
│   │   │   └── database.js
│   │   │
│   │   ├── 📁 middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── 📁 routes/
│   │   │   ├── authRoutes.js
│   │   │   └── CustomerRoutes.js
│   │   │
│   │   ├── 📁 services/
│   │   ├── server.js
│   │   └── test-db.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RoleProtectedRoute.jsx
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── CustomerDetails.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── StockMovement.jsx
│   │   │   └── Challans.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   ├── package.json
│   └── package-lock.json
│
└── README.md

🔌 REST API

Authentication

POST /api/auth/login

Customers

GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PUT    /api/customers/:id
DELETE /api/customers/:id

Products

GET    /api/products
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id

Stock Movements

GET  /api/stock-movements
POST /api/stock-movements

Challans

GET  /api/challans
POST /api/challans
GET  /api/challans/:id
PUT  /api/challans/:id

API paths should always match the final routes implemented in the backend.

🛡️ Validation & Error Handling

The backend validates:

Required fields

Email format

Positive quantities

Existing customers

Existing products

Available stock

Duplicate SKUs

Duplicate challan numbers

HTTP Status Codes

Code

Meaning

200

OK

201

Created

400

Bad Request

401

Unauthorized

403

Forbidden

404

Not Found

409

Conflict

500

Internal Server Error

⚙️ Environment Variables

Create:

backend/.env

Example:

PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=mini_erp_crm
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD

JWT_SECRET=YOUR_JWT_SECRET

🔒 Security

Never commit:

.env
node_modules/

Production secrets should be configured through the hosting platform's environment-variable settings.

🚀 Local Setup

1. Prerequisites

Install:

Node.js

npm

MySQL Server

Git

2. Clone Repository

git clone https://github.com/visi006/mini-erp-crm.git
cd mini-erp-crm

3. Backend

cd backend
npm install
npm start

Backend:

https://mini-erp-crm-backend-x5gm.onrender.com

4. Frontend

cd frontend
npm install
npm run dev

Frontend:

https://mini-erp-crm-frontend-ehtf.onrender.com

🗃️ MySQL Setup

Create the database:

CREATE DATABASE mini_erp_crm;
USE mini_erp_crm;

Run the schema:

SOURCE C:/Users/user/Desktop/mini-erp-crm/backend/src/db/schema.sql;

Verify:

SHOW TABLES;

Expected:

users
customers
products
stock_movements
challans
challan_items

🌐 Deployment

Current Deployment

Component

Platform

URL

🎨 Frontend

Render

https://mini-erp-crm-frontend-ehtf.onrender.com

⚙️ Backend

Render

https://mini-erp-crm-backend-x5gm.onrender.com

🗄️ Database

Avion SQL

MySQL

Production Architecture

                🌐 User
                  │
                  ▼
        ┌───────────────────┐
        │   Render Frontend │
        │      React        │
        └─────────┬─────────┘
                  │
                  │ HTTPS / REST
                  ▼
        ┌───────────────────┐
        │   Render Backend  │
        │ Node + Express    │
        └─────────┬─────────┘
                  │
                  ▼
        ┌───────────────────┐
        │    Avion SQL      │
        │      MySQL        │
        └───────────────────┘

🔑 Test Credentials

⚠️ These credentials are for development/demo testing only.

Role

Email

Password

👑 Admin

admin@minierp.com

admin123

💼 Sales

sales@minierp.com

sales123

🏭 Warehouse

warehouse@minierp.com

warehouse123

💰 Accounts

accounts@minierp.com

accounts123

🧪 Postman

Recommended collection:

Mini ERP CRM API
│
├── 🔐 Authentication
│   └── Login
│
├── 👥 Customers
│   ├── Get Customers
│   ├── Create Customer
│   ├── Get Customer
│   ├── Update Customer
│   └── Delete Customer
│
├── 📦 Products
│   ├── Get Products
│   ├── Create Product
│   ├── Get Product
│   └── Update Product
│
├── 🔄 Stock Movements
│   ├── Get Movements
│   └── Create Movement
│
└── 🧾 Challans
    ├── Get Challans
    ├── Create Challan
    ├── Get Challan
    └── Update Challan

Protected requests:

Authorization: Bearer <JWT_TOKEN>

🛣️ Frontend Routes

/login
/dashboard
/customers
/customers/:id
/products
/inventory
/stock-movement
/challans

📊 Dashboard

The dashboard provides an operational overview including:

👥 Total customers

📦 Total products

⚠️ Low-stock products

🧾 Recent challans

📉 Low-stock information

📝 GitHub Commit History

The project has been developed incrementally with feature-focused commits:

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

This demonstrates incremental development rather than a single bulk commit.

🎥 Demo Flow

The recommended project demonstration should cover:

1. 🔐 Login
       ↓
2. 📊 Dashboard
       ↓
3. 👥 Customer Management
       ↓
4. 📦 Product Management
       ↓
5. 🔄 Stock IN / OUT
       ↓
6. 🧾 Create Challan
       ↓
7. 📋 Add Multiple Products
       ↓
8. ✅ Confirm Challan
       ↓
9. 📉 Verify Stock Reduction
       ↓
10. 👁️ View Challan Details
       ↓
11. 🛡️ Test Insufficient Stock
       ↓
12. 🔐 Verify Role-Based Access



👨‍💻 Development

Built as a practical full-stack ERP/CRM case-study project demonstrating:

React + Node.js + Express + MySQL + JWT + REST APIs + Git/GitHub + Cloud Deployment

<p align="center">
  <b>🚀 Mini ERP + CRM Operations Portal</b><br/>
  <sub>Built with React • Node.js • Express • MySQL</sub>
</p>
