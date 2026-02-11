import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ msg: "User exists" });

  const user = await User.create({
    email,
    password,
    name,
  });

  res.json({ msg: "User Created" });
});

export default router;
