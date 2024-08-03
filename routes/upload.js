const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const multer = require("multer");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/uploadImage", upload.single("image"), async (req, res) => {
  try {
    const form = new FormData();
    form.append("image", req.file.buffer, req.file.originalname);

    const response = await axios.post("https://api.imgur.com/3/image", form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer b0c69d602d90f8e62f91e776f31d1156fd600c8a`
      }
    });

    const imageUrl = response.data.data.link;
    res.json({ imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image" });
  }
});

module.exports = router;
