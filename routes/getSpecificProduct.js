const express = require("express");
const router = express.Router();
const Product = require("../models/product.model.js");
const Collection = require("../models/collections.model.js");
const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  try {
    const { productId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(productId).populate(
      "parentCollection"
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      product,
      collection: product.parentCollection || null,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Failed to fetch product details" });
  }
});
module.exports = router;
