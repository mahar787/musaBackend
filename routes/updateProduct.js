const express = require("express");
const multer = require("multer");
const Product = require("../models/product.model.js");
const cloudinary = require("cloudinary").v2; // Cloudinary for image handling
const router = express.Router();
const mongoose = require("mongoose");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // ✅ 10MB limit (images + PDFs)
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_DATABASE,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🛠 Update Product Route
router.post("/", upload.array("files", 10), async (req, res) => {
  try {
    const {
      productId,
      name,
      price,
      // sizes,
      // colors,
      materials,
      descriptionPoints,
      caringInstructions,
      usageInstructions,
      youtubeVideo,
      parentCollection,
      existingImages,
    } = req.body;

    // Find the existing product
    let productIdd = new mongoose.Types.ObjectId(productId);
    const product = await Product.findById(productIdd);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Convert values
    // const updatedSizes = sizes
    //   ? sizes.split(",").map((s) => s.trim())
    //   : product.sizes;
    // const updatedColors = colors
    //   ? colors.split(",").map((c) => c.trim())
    //   : product.colors;
    const updatedMaterials = materials
      ? materials.split(",").map((m) => m.trim())
      : product.materials;
    const updatedDescPoints = descriptionPoints
      ? JSON.parse(descriptionPoints)
      : product.descriptionPoints;
    const updatedCaringInstructions = caringInstructions
      ? JSON.parse(caringInstructions)
      : product.caringInstructions;
    const updatedUsageInstructions = usageInstructions
      ? JSON.parse(usageInstructions)
      : product.usageInstructions;

    // Handle image deletion
    if (existingImages) {
      const imagesToKeep = JSON.parse(existingImages);
      const imagesToDelete = product.images.filter(
        (img) => !imagesToKeep.includes(img.url)
      );

      for (const img of imagesToDelete) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      product.images = product.images.filter((img) =>
        imagesToKeep.includes(img.url)
      );
    }

    // Upload new images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                product.images.push({
                  url: result.secure_url,
                  public_id: result.public_id,
                });
                resolve();
              }
            }
          );
          uploadStream.end(file.buffer);
        });
      }
    }

    // Update product fields
    product.name = name || product.name;
    product.price = price || product.price;
    // product.sizes = updatedSizes;
    // product.colors = updatedColors;
    product.materials = updatedMaterials;
    product.descriptionPoints = updatedDescPoints;
    product.caringInstructions = updatedCaringInstructions;
    product.usageInstructions = updatedUsageInstructions;
    product.youtubeVideo = youtubeVideo || product.youtubeVideo;
    product.parentCollection = parentCollection || product.parentCollection;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product" });
  }
});

module.exports = router;
