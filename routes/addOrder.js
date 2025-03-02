const express = require("express");
const router = express.Router();
const Order = require("../models/order.model.js");
const mongoose = require("mongoose");
const order = router.post("/", async (req, res) => {
  try {
    let id = req.body.orderId;
    id = new mongoose.Types.ObjectId(id);
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { paymentStatus: "Paid" }, // Order status update kar raha hai
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Your Order Placed Successfully!", data: updatedOrder });
  } catch (error) {
    console.log("Error in updating order payment status!", error);
  }
});
module.exports = router;
