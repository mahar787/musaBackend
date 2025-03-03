const express = require("express");
const router = express.Router();
const Collection = require("../models/collections.model.js");
const Product = require("../models/product.model.js");

// Random collection aur uss se related products fetch karne ka route
router.get("/", async (req, res) => {
  try {
    // Random aik collection uthao
    const randomCollections = await Collection.aggregate([
      { $sample: { size: 3 } },
    ]);

    // Agar collection nahi mili toh error bhejo
    if (!randomCollections.length) {
      return res.status(404).json({ message: "No collections found" });
    }
    // Har collection ke products fetch karne ka promise banao
    const collectionsWithProducts = await Promise.all(
      randomCollections.map(async (collection) => {
        const products = await Product.find({
          parentCollection: collection._id,
        });
        return { collection, products };
      })
    );

    // Response frontend ko bhejo
    res.status(200).json({ data: collectionsWithProducts });
  } catch (error) {
    console.error("Error fetching random collection:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
