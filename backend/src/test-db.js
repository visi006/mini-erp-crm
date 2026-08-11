const pool = require("./db/database");

async function testConnection() {
    try {
        const connection = await pool.getConnection();

        console.log("✅ MySQL connected successfully!");

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error("❌ MySQL connection failed:");
        console.error(error.message);
        process.exit(1);
    }
}

testConnection();