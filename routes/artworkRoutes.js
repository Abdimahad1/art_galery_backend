import express from "express";
import Artwork from "../models/Artwork.js";
import Profile from "../models/Profile.js"; // 🔥 ADD THIS
import { markAsSold } from "../controllers/artworkController.js";

import {
  createArtwork,
  getMyArtworks,
  updateArtwork,
  deleteArtwork,
  updateArtworkStatus,
} from "../controllers/artworkController.js";

import { protect, artistOnly, adminOnly } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

/* ================= ARTIST ROUTES ================= */

// CREATE
router.post("/", protect, artistOnly, upload.single("image"), createArtwork);

// GET MY ARTWORKS
router.get("/my", protect, artistOnly, getMyArtworks);

// UPDATE
router.put("/:id", protect, artistOnly, upload.single("image"), updateArtwork);

// DELETE
router.delete("/:id", protect, artistOnly, deleteArtwork);

// 🔥 MARK AS SOLD
router.put("/sold/:id", protect, artistOnly, markAsSold);

/* ================= ADMIN ROUTES ================= */

// GET ALL ARTWORKS
router.get("/admin", protect, adminOnly, async (req, res) => {
  try {
    const artworks = await Artwork.find()
      .populate("artist", "name email")
      .sort({ createdAt: -1 });

    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// APPROVE / REJECT
router.put("/status/:id", protect, adminOnly, updateArtworkStatus);

/* ================= PUBLIC ROUTES ================= */

// CUSTOMER VIEW
router.get("/public", async (req, res) => {
  try {
    const artworks = await Artwork.find({ status: "approved" })
      .populate("artist", "name email")
      .sort({ createdAt: -1 });

    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= DETAILS ROUTE (🔥 FIXED) ================= */

router.get("/details/:id", async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate("artist", "name email");

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    // 🔥 FETCH PROFILE
    const profile = await Profile.findOne({
      user: artwork.artist._id,
    });

    // 🔥 MERGE RESPONSE
    res.json({
      ...artwork._doc,
      artistProfile: profile || {},
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;