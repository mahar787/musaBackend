const express = require("express");
const router = express.Router();
const Collection = require("../models/collections.model.js");
const Product = require("../models/product.model.js");

// Random collection aur uss se related products fetch karne ka route
router.get("/", async (req, res) => {
  try {
    // Random aik collection uthao
    const randomCollection = await Collection.aggregate([
      { $sample: { size: 1 } },
    ]);

    // Agar collection nahi mili toh error bhejo
    if (!randomCollection.length) {
      return res.status(404).json({ message: "No collections found" });
    }

    const collection = randomCollection[0];

    // Uss collection se related products fetch karo
    const products = await Product.find({ parentCollection: collection._id });

    // Response frontend ko bhejo
    res.json({ collection, products });
  } catch (error) {
    console.error("Error fetching random collection:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
