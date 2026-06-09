import mongoose from "mongoose";

const artworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    category: String,

    image: { type: String }, // image path or URL

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
    type: String,
    enum: ["pending", "approved", "rejected", "sold"], // ✅ ADD SOLD
    default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Artwork", artworkSchema);