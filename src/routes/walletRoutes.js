const express = require("express");
const router = express.Router();
const { addSavings, addExpense, deleteExpense, saveCart, getSpending, getRecentTransactions } = require("../controllers/walletController");
const { protect } = require("../middleware/authMiddleware");

router.post("/savings", protect, addSavings);
router.post("/expenses", protect, addExpense);
router.delete("/expenses/:id", protect, deleteExpense);
router.get("/spending", protect, getSpending);
router.get("/recent-transactions", protect, getRecentTransactions);
router.post("/cart", protect, saveCart);

module.exports = router;
