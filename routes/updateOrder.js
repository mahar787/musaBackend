const express = require("express");
const router = express.Router();
const Order = require("../models/order.model.js");

router.post("/", async (req, res) => {
  try {
    const { orderId, paymentStatus, orderStatus } = req.body;

    // Validate input
    if (!orderId || !paymentStatus || !orderStatus) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find and update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus, orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order updated successfully", updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

module.exports = router;
