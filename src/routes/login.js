import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { Router } from "express";
import config from "../../config/dbconfig.js";

const db = config.get(process.env.NODE_ENV);
const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, password2, ...rest } = req.body;
    if (password !== password2)
      return res.status(400).json({ message: "Passwords do not match" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ email, password, ...rest });
    const doc = await newUser.save();

    jwt.sign(
      { user_id: doc._id.toHexString() },
      db.SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err)
          return res.status(500).json({ message: "Error signing token", error: err });
        res.status(200).json({
          message: "User signed up successfully 🚀",
          user: doc.email,
          token: token,
        });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Error saving user", error: err });
  }
});

export default router;