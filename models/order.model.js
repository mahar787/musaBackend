const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    contact: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      required: true,
    },
    apartment: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    items: [
      {
        orderItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "OrderItem",
          required: true,
        },
      },
    ],
    paymentStatus: {
      type: String,
      default: "pending",
    },
    orderStatus: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
