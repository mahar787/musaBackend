const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Collection = require("../models/collections.model.js");
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_DATABASE,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // ✅ 10MB limit (10 * 1024 * 1024 bytes)
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { name, descriptionPoints } = req.body;
    const pointsArray = JSON.parse(descriptionPoints); // Convert string to array

    // Upload File (Image or PDF) to Cloudinary
    cloudinary.uploader
      .upload_stream(
        {
          folder: "collections",
          resource_type: "auto", // Supports both images & PDFs
        },
        async (error, uploadedFile) => {
          if (error) return res.status(500).json({ error: "Upload Failed" });

          // Convert PDF to PNG (if PDF is uploaded)
          let imageUrl = uploadedFile.secure_url;
          if (uploadedFile.format === "pdf") {
            imageUrl = imageUrl.replace(".pdf", ".png") + "?pg=1&dpi_300";
          }

          // Save to MongoDB
          const newCollection = new Collection({
            name,
            image: imageUrl, // Store converted image URL
            imagePublicId: uploadedFile.public_id,
            descriptionPoints: pointsArray,
          });

          await newCollection.save();
          res.status(200).json({ message: "Collection Added Successfully!" });
        }
      )
      .end(req.file.buffer);
  } catch (err) {
    console.log("Error in adding collection", err);
    res.status(500).json({ message: "Server error. Try again later!" });
  }
});

module.exports = router;
