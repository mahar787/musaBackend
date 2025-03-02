const express = require("express");
const Product = require("../models/product.model.js");

const router = express.Router();

// Search Route
router.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Case-insensitive partial match using regex
    const searchResults = await Product.find(
      { name: { $regex: query, $options: "i" } } // "i" for case-insensitive
    ).limit(10); // Limit results to 10 suggestions

    res.json(searchResults);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
