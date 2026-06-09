import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import artworkRoutes from "./routes/artworkRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";


dotenv.config();

const app = express();

// 🔹 MIDDLEWARE
app.use(cors());
app.use(express.json());

// 🔥 SERVE STATIC FILES (VERY IMPORTANT)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 🔹 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/artworks", artworkRoutes);
app.use("/api/profile", profileRoutes);
// 🔹 DB CONNECT
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// 🔹 SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});