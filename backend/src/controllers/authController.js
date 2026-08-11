const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Temporary users
// Later we will move these users into MongoDB.
const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@minierp.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "Admin",
  },
  {
    id: 2,
    name: "Sales User",
    email: "sales@minierp.com",
    password: bcrypt.hashSync("sales123", 10),
    role: "Sales",
  },
  {
    id: 3,
    name: "Warehouse User",
    email: "warehouse@minierp.com",
    password: bcrypt.hashSync("warehouse123", 10),
    role: "Warehouse",
  },
  {
    id: 4,
    name: "Accounts User",
    email: "accounts@minierp.com",
    password: bcrypt.hashSync("accounts123", 10),
    role: "Accounts",
  },
];

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = users.find(
      (user) =>
        user.email.toLowerCase() ===
        email.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  login,
};