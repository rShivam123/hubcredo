const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');
const requireAuth = require('../middleware/auth');

// ----------------- SIGNUP -----------------
router.post('/signup', async (req, res) => {
  const { name = "", email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    // Send welcome email 
    sendEmail({
      to: user.email,
      subject: "Welcome to Our App!",
      html: `<h2>Welcome ${user.name || "User"}!</h2><p>Your signup was successful.</p>`
    })
    .then(() => console.log("Signup email sent:", user.email))
    .catch(err => console.error("Signup email failed:", err.message));

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { email: user.email, name: user.name }, message: "User created successfully" });

  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------- LOGIN -----------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { email: user.email, name: user.name }, message: "Login successful" });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------- GET LOGGED-IN USER -----------------
router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
});

module.exports = router;
