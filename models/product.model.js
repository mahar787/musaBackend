const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  materials: [{ type: String, required: true }], // Multiple materials
  descriptionPoints: [{ type: String }],
  caringInstructions: [{ type: String }],
  usageInstructions: [{ type: String }],
  youtubeVideo: { type: String, default: null },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ], // Image URLs
  parentCollection: { type: mongoose.Schema.Types.ObjectId, ref: "Collection" },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
