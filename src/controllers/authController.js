const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register a new user
// @route   POST /signup
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ username, email, password });

    if (user) {
      res.status(201).json({
        message: "User registered successfully!",
        token: generateToken(user._id),
        userName: user.username,
        userEmail: user.email
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// @desc    Auth user & get token
// @route   POST /login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        message: "Login successful",
        token: generateToken(user._id),
        userName: user.username,
        userEmail: user.email
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// @desc    Update user budget
// @route   PUT /update-budget
// @access  Private
exports.updateBudget = async (req, res) => {
  try {
    const { budget } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.monthlyBudget = budget;
    await user.save();

    res.json({ message: "Budget updated successfully", budget: user.monthlyBudget });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
