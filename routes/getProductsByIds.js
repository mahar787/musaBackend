const express = require("express");
const router = express.Router();
const Product = require("../models/product.model.js");
const mongoose = require("mongoose");
// Route to fetch multiple products by IDs
router.post("/", async (req, res) => {
  try {
    const { ids } = req.body; // Receiving product IDs from frontend
    console.log(req.body);

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid product IDs array" });
    }
    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

    // Fetch products from DB
    const products = await Product.find({ _id: { $in: objectIds } });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
