const express = require("express");
const Product = require("../models/product.model.js");

const router = express.Router();

// ✅ Get products by collection ID with filters & sorting
router.get("/:collectionId", async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { minPrice, maxPrice, sortBy, order } = req.query;

    let filter = { parentCollection: collectionId };

    // ✅ Apply price filters (if provided)
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // ✅ Sorting logic
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }

    // ✅ Fetch filtered & sorted products
    const products = await Product.find(filter).sort(sortOptions);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error! Try again later." });
  }
});

module.exports = router;
