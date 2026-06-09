import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔐 PROTECT ROUTE
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 🛡️ ADMIN ONLY
export const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
};

// 🎨 ARTIST ONLY
export const artistOnly = (req, res, next) => {
  if (req.user?.role === "artist") {
    return next();
  }
  return res.status(403).json({ message: "Artist access only" });
};

// 🔄 MULTI-ROLE (Flexible)
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user?.role)) {
      return next();
    }
    return res.status(403).json({ message: "Access denied" });
  };
};