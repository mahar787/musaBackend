const mongoose = require("mongoose");
const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    selectedSizes: [{ type: String }],
    selectedColors: [{ type: String }],
  },
  { timestamps: true }
);

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItem;
