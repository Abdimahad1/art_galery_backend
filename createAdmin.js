import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect DB
    await mongoose.connect(process.env.MONGO_URI);

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 12);

    // Create admin
    const admin = await User.create({
      name: "Admin User",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created successfully");
    console.log(admin);

    process.exit();

  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();