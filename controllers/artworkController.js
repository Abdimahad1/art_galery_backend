import Artwork from "../models/Artwork.js";
import fs from "fs";
import path from "path";

// 🔥 CREATE ARTWORK
export const createArtwork = async (req, res) => {
  try {
    const { title, price, description, category } = req.body;

    if (!title || !price) {
      return res.status(400).json({
        message: "Title and price are required",
      });
    }

    const artwork = await Artwork.create({
      title,
      price,
      description,
      category,
      image: req.file ? `uploads/${req.file.filename}` : "",
      artist: req.user._id,
    });

    res.status(201).json(artwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 GET MY ARTWORKS
export const getMyArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find({
      artist: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 UPDATE ARTWORK
export const updateArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    // 🔒 Check ownership
    if (artwork.artist.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 🔹 Update fields
    artwork.title = req.body.title || artwork.title;
    artwork.price = req.body.price || artwork.price;
    artwork.description = req.body.description || artwork.description;
    artwork.category = req.body.category || artwork.category;

    // 🔥 HANDLE IMAGE UPDATE
    if (req.file) {
      // delete old image
      if (artwork.image) {
        const oldPath = path.join(process.cwd(), artwork.image);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // save new image
      artwork.image = `uploads/${req.file.filename}`;
    }

    const updated = await artwork.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 DELETE ARTWORK
export const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    // 🔒 Check ownership
    if (artwork.artist.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 🔥 DELETE IMAGE FILE
    if (artwork.image) {
      const filePath = path.join(process.cwd(), artwork.image);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await artwork.deleteOne();

    res.json({ message: "Artwork deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateArtworkStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    artwork.status = status; // approved | rejected
    await artwork.save();

    res.json({ message: "Status updated", artwork });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 🔥 MARK AS SOLD
export const markAsSold = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    // 🔒 Only owner can mark as sold
    if (artwork.artist.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    artwork.status = "sold";
    await artwork.save();

    res.json({ message: "Artwork marked as sold", artwork });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};