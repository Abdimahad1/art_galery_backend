import multer from "multer";
import fs from "fs";
import path from "path";

// 🔹 Ensure uploads folder exists
const uploadPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// 🔹 STORAGE CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.originalname
      .replace(ext, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    cb(null, Date.now() + "-" + name + ext);
  },
});

// 🔹 FILE FILTER (ONLY IMAGES)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
});