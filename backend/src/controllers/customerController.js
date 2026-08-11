const pool = require("../db/database");

// GET /api/customers
const getCustomers = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Validate pagination
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                message: "Page must be >= 1 and limit must be between 1 and 100"
            });
        }

        const offset = (page - 1) * limit;

        // Search and filter
        const search = req.query.search || "";
        const status = req.query.status || "";
        const customerType = req.query.customer_type || "";

        let whereConditions = [];
        let values = [];

        // Search by name, mobile, email or business name
        if (search) {
            whereConditions.push(`
                (
                    name LIKE ?
                    OR mobile LIKE ?
                    OR email LIKE ?
                    OR business_name LIKE ?
                )
            `);

            const searchValue = `%${search}%`;

            values.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );
        }

        // Filter by status
        if (status) {
            const allowedStatuses = ["Lead", "Active", "Inactive"];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    message: "Invalid status. Use Lead, Active or Inactive"
                });
            }

            whereConditions.push("status = ?");
            values.push(status);
        }

        // Filter by customer type
        if (customerType) {
            const allowedTypes = [
                "Retail",
                "Wholesale",
                "Distributor"
            ];

            if (!allowedTypes.includes(customerType)) {
                return res.status(400).json({
                    message:
                        "Invalid customer_type. Use Retail, Wholesale or Distributor"
                });
            }

            whereConditions.push("customer_type = ?");
            values.push(customerType);
        }

        const whereClause =
            whereConditions.length > 0
                ? `WHERE ${whereConditions.join(" AND ")}`
                : "";

        // Get total number of customers
        const [countResult] = await pool.query(
            `SELECT COUNT(*) AS total
             FROM customers
             ${whereClause}`,
            values
        );

        const total = countResult[0].total;

        // Get customers
        const [customers] = await pool.query(
            `SELECT
                id,
                name,
                mobile,
                email,
                business_name,
                gst_number,
                customer_type,
                address,
                status,
                follow_up_date,
                notes,
                created_at,
                updated_at
             FROM customers
             ${whereClause}
             ORDER BY id DESC
             LIMIT ? OFFSET ?`,
            [...values, limit, offset]
        );

        return res.status(200).json({
            message: "Customers fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            customers
        });

    } catch (error) {
        console.error("Get customers error:", error);

        return res.status(500).json({
            message: "Failed to fetch customers"
        });
    }
};


// POST /api/customers
const createCustomer = async (req, res) => {
    try {
        const {
            name,
            mobile,
            email,
            business_name,
            gst_number,
            customer_type,
            address,
            status,
            follow_up_date,
            notes
        } = req.body;

        // Required fields
        if (!name || !mobile || !customer_type) {
            return res.status(400).json({
                message: "Name, mobile and customer_type are required"
            });
        }

        // Validate mobile
        if (!/^[0-9]{10}$/.test(mobile)) {
            return res.status(400).json({
                message: "Mobile number must contain exactly 10 digits"
            });
        }

        // Validate email if provided
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: "Invalid email format"
                });
            }
        }

        // Validate customer type
        const allowedTypes = [
            "Retail",
            "Wholesale",
            "Distributor"
        ];

        if (!allowedTypes.includes(customer_type)) {
            return res.status(400).json({
                message:
                    "Invalid customer_type. Use Retail, Wholesale or Distributor"
            });
        }

        // Validate status
        const allowedStatuses = [
            "Lead",
            "Active",
            "Inactive"
        ];

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message:
                    "Invalid status. Use Lead, Active or Inactive"
            });
        }

        // Insert customer
        const [result] = await pool.query(
            `INSERT INTO customers
            (
                name,
                mobile,
                email,
                business_name,
                gst_number,
                customer_type,
                address,
                status,
                follow_up_date,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                mobile,
                email || null,
                business_name || null,
                gst_number || null,
                customer_type,
                address || null,
                status || "Active",
                follow_up_date || null,
                notes || null
            ]
        );

        return res.status(201).json({
            message: "Customer created successfully",
            customerId: result.insertId
        });

    } catch (error) {
        console.error("Create customer error:", error);

        return res.status(500).json({
            message: "Failed to create customer"
        });
    }
};


// GET /api/customers/:id
const getCustomerById = async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);

        // Validate ID
        if (!Number.isInteger(customerId) || customerId <= 0) {
            return res.status(400).json({
                message: "Invalid customer ID"
            });
        }

        const [customers] = await pool.query(
            `SELECT
                id,
                name,
                mobile,
                email,
                business_name,
                gst_number,
                customer_type,
                address,
                status,
                follow_up_date,
                notes,
                created_at,
                updated_at
             FROM customers
             WHERE id = ?`,
            [customerId]
        );

        // Customer not found
        if (customers.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        return res.status(200).json({
            message: "Customer fetched successfully",
            customer: customers[0]
        });

    } catch (error) {
        console.error("Get customer error:", error);

        return res.status(500).json({
            message: "Failed to fetch customer"
        });
    }
};


// PUT /api/customers/:id
const updateCustomer = async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);

        // Validate ID
        if (!Number.isInteger(customerId) || customerId <= 0) {
            return res.status(400).json({
                message: "Invalid customer ID"
            });
        }

        const {
            name,
            mobile,
            email,
            business_name,
            gst_number,
            customer_type,
            address,
            status,
            follow_up_date,
            notes
        } = req.body;

        // Check required fields
        if (!name || !mobile || !customer_type) {
            return res.status(400).json({
                message: "Name, mobile and customer_type are required"
            });
        }

        // Validate mobile
        if (!/^[0-9]{10}$/.test(mobile)) {
            return res.status(400).json({
                message: "Mobile number must contain exactly 10 digits"
            });
        }

        // Validate email
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: "Invalid email format"
                });
            }
        }

        // Validate customer type
        const allowedTypes = [
            "Retail",
            "Wholesale",
            "Distributor"
        ];

        if (!allowedTypes.includes(customer_type)) {
            return res.status(400).json({
                message:
                    "Invalid customer_type. Use Retail, Wholesale or Distributor"
            });
        }

        // Validate status
        const allowedStatuses = [
            "Lead",
            "Active",
            "Inactive"
        ];

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message:
                    "Invalid status. Use Lead, Active or Inactive"
            });
        }

        // Check whether customer exists
        const [existingCustomer] = await pool.query(
            "SELECT id FROM customers WHERE id = ?",
            [customerId]
        );

        if (existingCustomer.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        // Update customer
        await pool.query(
            `UPDATE customers
             SET
                name = ?,
                mobile = ?,
                email = ?,
                business_name = ?,
                gst_number = ?,
                customer_type = ?,
                address = ?,
                status = ?,
                follow_up_date = ?,
                notes = ?
             WHERE id = ?`,
            [
                name,
                mobile,
                email || null,
                business_name || null,
                gst_number || null,
                customer_type,
                address || null,
                status || "Active",
                follow_up_date || null,
                notes || null,
                customerId
            ]
        );

        return res.status(200).json({
            message: "Customer updated successfully",
            customerId
        });

    } catch (error) {
        console.error("Update customer error:", error);

        return res.status(500).json({
            message: "Failed to update customer"
        });
    }
};
// DELETE /api/customers/:id
const deleteCustomer = async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);

        // Validate ID
        if (!Number.isInteger(customerId) || customerId <= 0) {
            return res.status(400).json({
                message: "Invalid customer ID"
            });
        }

        // Check whether customer exists
        const [existingCustomer] = await pool.query(
            "SELECT id FROM customers WHERE id = ?",
            [customerId]
        );

        if (existingCustomer.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        // Delete customer
        await pool.query(
            "DELETE FROM customers WHERE id = ?",
            [customerId]
        );

        return res.status(200).json({
            message: "Customer deleted successfully",
            customerId
        });

    } catch (error) {
        console.error("Delete customer error:", error);

        return res.status(500).json({
            message: "Failed to delete customer"
        });
    }
};

module.exports = {
    getCustomers,
    createCustomer,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};