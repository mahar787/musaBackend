const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
// const DBCON = async function dbConnect() {
async function DBCON() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (error) {
    console.log("Database Connection Problem !", error);
    process.exit();
  }
}
module.exports = DBCON;
