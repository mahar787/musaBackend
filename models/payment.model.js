const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    imagePublicId: { type: String, required: true },
    orderId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
