import express from "express";
import User from "../models/User.js";

import {
  getUsers,
  createUser,
  deleteUser,
  updateUser
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= ADMIN ROUTES ================= */

// 🔐 Admin only management
router.get("/", protect, adminOnly, getUsers);
router.post("/", protect, adminOnly, createUser);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);


/* ================= FAVORITES ================= */

// ➤ ADD TO FAVORITES
router.post("/favorites/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(req.params.id)) {
      user.favorites.push(req.params.id);
      await user.save();
    }

    res.json({ message: "Added to favorites" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ➤ REMOVE FROM FAVORITES
router.delete("/favorites/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== req.params.id
    );

    await user.save();

    res.json({ message: "Removed from favorites" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ➤ GET FAVORITES
router.get("/favorites", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "favorites",
      populate: {
        path: "artist",
        select: "name",
      },
    });

    res.json(user.favorites);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* ================= CART ================= */

// ➤ ADD TO CART
router.post("/cart/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const itemIndex = user.cart.findIndex(
      (item) => item.artwork.toString() === req.params.id
    );

    if (itemIndex > -1) {
      // already exists → increase quantity
      user.cart[itemIndex].quantity += 1;
    } else {
      user.cart.push({
        artwork: req.params.id,
        quantity: 1,
      });
    }

    await user.save();

    res.json({ message: "Added to cart" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ➤ GET CART
router.get("/cart", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "cart.artwork",
      populate: {
        path: "artist",
        select: "name",
      },
    });

    res.json(user.cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ➤ UPDATE QUANTITY
router.put("/cart/:id", protect, async (req, res) => {
  try {
    const { quantity } = req.body;

    const user = await User.findById(req.user._id);

    const item = user.cart.find(
      (item) => item.artwork.toString() === req.params.id
    );

    if (item) {
      item.quantity = quantity;
      await user.save();
    }

    res.json({ message: "Cart updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ➤ REMOVE FROM CART
router.delete("/cart/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item.artwork.toString() !== req.params.id
    );

    await user.save();

    res.json({ message: "Removed from cart" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;