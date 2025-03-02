const express = require("express");
const router = express.Router();
const Order = require("../models/order.model.js");

router.get("/", async (req, res) => {
  try {
    let { page = 1 } = req.query; // Default page 1
    page = parseInt(page);

    const limit = 30; // Show 30 orders per page
    const skip = (page - 1) * limit;

    // Fetch orders with sorting (latest first) and pagination
    const orders = await Order.find()
      .sort({ createdAt: -1 }) // Sorting by latest orders
      .skip(skip)
      .limit(limit);

    // Total number of orders for pagination info
    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;
