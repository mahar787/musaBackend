const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = require("../models/order.model.js");
const OrderItem = require("../models/orderItem.model.js");

router.post("/", async (req, res) => {
  try {
    const { orderId } = req.body;

    // Check if orderId is valid
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order ID" });
    }

    // Fetch order and populate order items and products
    const order = await Order.findById(orderId).populate({
      path: "items.orderItemId",
      model: "OrderItem",
      populate: {
        path: "productId",
        model: "Product",
      },
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Extract merged items with product details
    const mergedItems = order.items.map((item) => ({
      orderItemId: item.orderItemId._id,
      name: item.orderItemId.name,
      price: item.orderItemId.price,
      quantity: item.orderItemId.quantity,
      product: item.orderItemId.productId, // Yeh poori product details bhej raha hai
    }));

    // Send response
    res.status(200).json({
      success: true,
      order: {
        ...order.toObject(),
        items: mergedItems, // Updated items with product details
      },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
});

module.exports = router;
