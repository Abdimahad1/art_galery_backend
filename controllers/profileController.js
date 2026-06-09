import Profile from "../models/Profile.js";
import fs from "fs";
import path from "path";

// 🔥 GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.json(null);
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 CREATE OR UPDATE PROFILE
export const saveProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });

    // 🔹 If exists → update
    if (profile) {

      profile.name = req.body.name;
      profile.bio = req.body.bio;
      profile.style = req.body.style;
      profile.experience = req.body.experience;
      profile.location = req.body.location;
      profile.phone = req.body.phone;
      profile.instagram = req.body.instagram;
      profile.twitter = req.body.twitter;
      profile.website = req.body.website;

      // 🔥 IMAGE UPDATE
      if (req.file) {
        if (profile.image) {
          const oldPath = path.join(process.cwd(), profile.image);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        profile.image = `uploads/${req.file.filename}`;
      }

      const updated = await profile.save();
      return res.json(updated);
    }

    // 🔹 Create new profile
    const newProfile = await Profile.create({
      user: req.user._id,
      name: req.body.name,
      email: req.user.email,
      bio: req.body.bio,
      style: req.body.style,
      experience: req.body.experience,
      location: req.body.location,
      phone: req.body.phone,
      instagram: req.body.instagram,
      twitter: req.body.twitter,
      website: req.body.website,
      image: req.file ? `uploads/${req.file.filename}` : "",
    });

    res.status(201).json(newProfile);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};