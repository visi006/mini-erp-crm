const express = require("express");

const {
    getCustomers,
    createCustomer,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} = require("../controllers/customerController");

const router = express.Router();

// GET all customers
router.get("/", getCustomers);

// CREATE customer
router.post("/", createCustomer);

// GET customer by ID
router.get("/:id", getCustomerById);

// UPDATE customer
router.put("/:id", updateCustomer);

// DELETE customer
router.delete("/:id", deleteCustomer);

module.exports = router;