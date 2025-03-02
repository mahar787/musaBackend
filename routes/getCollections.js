const express = require("express");
const router = express.Router();
const Collection = require("../models/collections.model.js");
router.get("/", async (req, res) => {
  try {
    let collections = await Collection.find({});
    res.status(200).json({ data: collections });
  } catch (error) {
    console.log("error in fetching collections", error);
    res.status(500);
  }
});

module.exports = router;
