const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // Store image URL
      required: true,
    },
    imagePublicId: { type: String, required: true },
    descriptionPoints: {
      type: [String], // Array of strings for bullet points
      required: true,
    },
  },
  { timestamps: true }
);

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
