import express from "express";
import { getProfile, saveProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// GET PROFILE
router.get("/", protect, getProfile);

// CREATE / UPDATE PROFILE
router.post("/", protect, upload.single("image"), saveProfile);

export default router;