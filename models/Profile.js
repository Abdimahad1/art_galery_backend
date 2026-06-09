import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // 🔹 BASIC INFO
    name: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    // 🔹 ARTIST INFO
    bio: {
      type: String,
      trim: true,
      default: "",
    },

    style: {
      type: String,
      trim: true,
      default: "",
    },

    experience: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    // 🔥 IMPORTANT (WHATSAPP)
    phone: {
      type: String,
      trim: true,
      default: "",
    },

    // 🔹 SOCIAL LINKS
    instagram: {
      type: String,
      trim: true,
      default: "",
    },

    twitter: {
      type: String,
      trim: true,
      default: "",
    },

    website: {
      type: String,
      trim: true,
      default: "",
    },

    // 🔹 PROFILE IMAGE
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);