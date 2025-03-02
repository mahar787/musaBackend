const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Product = require("../models/product.model.js");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_DATABASE,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // ✅ 10MB limit (images + PDFs)
});

router.post("/", upload.array("files", 10), async (req, res) => {
  try {
    const {
      name,
      price,
      sizes,
      colors,
      materials,
      descriptionPoints,
      caringInstructions,
      bestSizeForYou,
      youtubeVideo,
      parentCollection,
    } = req.body;

    // ✅ Convert comma-separated strings into arrays if needed
    const toArray = (data) =>
      typeof data === "string" ? data.split(",").map((s) => s.trim()) : [];

    const safeParse = (data) => {
      try {
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error("JSON Parse Error:", data, error);
        return [];
      }
    };

    const youtubeVideoSafe = youtubeVideo || "";

    const uploadedFiles = await Promise.all(
      req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                { folder: "products", resource_type: "auto" },
                (error, uploadedFile) => {
                  if (error) return reject(error);
                  resolve({
                    url: uploadedFile.secure_url,
                    public_id: uploadedFile.public_id, // ✅ Fix here
                  });
                }
              )
              .end(file.buffer);
          })
      )
    );

    const product = new Product({
      name,
      price: Number(price) || 0, // ✅ Ensure price is a number
      sizes: toArray(sizes),
      colors: toArray(colors),
      materials: toArray(materials),
      descriptionPoints: safeParse(descriptionPoints),
      caringInstructions: safeParse(caringInstructions),
      usageInstructions: safeParse(bestSizeForYou),
      youtubeVideo: youtubeVideoSafe,
      parentCollection,
      images: uploadedFiles,
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error in adding product:", error);
    res.status(500).json({ message: "Server error. Try again later!" });
  }
});

module.exports = router;
