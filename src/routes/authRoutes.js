const express = require("express");
const router = express.Router();
const { registerUser, loginUser, updateBudget } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.put("/update-budget", protect, updateBudget);

module.exports = router;
