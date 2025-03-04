const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

async function DBCON() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("Database Connection Problem!", error);
    process.exit(1); // Exit process if DB connection fails
  }
}

module.exports = DBCON;
