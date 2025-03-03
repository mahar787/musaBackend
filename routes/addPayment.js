const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const Payment = require("../models/payment.model.js");

const router = express.Router();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_DATABASE,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage (Local Temp Folder)
const upload = multer({ dest: "uploads/" });

// 📌 POST Route to Upload Image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided!" });
    }

    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required!" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "payments",
    });

    // Delete Temp File After Upload
    fs.unlinkSync(req.file.path);

    // Save to Database
    const newPayment = new Payment({
      image: result.secure_url, // Cloudinary Image URL
      imagePublicId: result.public_id, // Public ID
      orderId,
    });

    await newPayment.save();

    res.status(200).json({
      message: "Payment proof uploaded successfully!",
      newPayment,
    });
  } catch (error) {
    console.error("Error in uploading payment proof:", error);
    res
      .status(500)
      .json({ message: "Error uploading image", error: error.message });
  }
});

module.exports = router;
