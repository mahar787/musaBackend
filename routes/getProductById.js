const express = require("express");
const router = express.Router();
const Product = require("../models/product.model.js");
const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  try {
    let id = req.body;
    id = new mongoose.Types.ObjectId(id);
    let product = await Product.findById(id);
    res.status(200).json({ data: product });
  } catch (error) {
    console.log("error in fetching product", error);
  }
});
module.exports = router;
