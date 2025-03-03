const express = require("express");
const Payment = require("../models/payment.model.js");

const router = express.Router();

// GET payments with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page 1
    const limit = 25; // 25 records per page
    const skip = (page - 1) * limit; // Skipping previous records

    // Fetch payments with pagination
    const payments = await Payment.find()
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    // Total count of payments (for pagination)
    const totalPayments = await Payment.countDocuments();

    res.status(200).json({
      payments,
      currentPage: page,
      totalPages: Math.ceil(totalPayments / limit),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching payments", error: error.message });
  }
});

module.exports = router;
