import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "artist", "customer"],
      default: "customer",
    },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artwork",
      },
    ],

    // 🔥 CART
    cart: [
      {
        artwork: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Artwork",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;