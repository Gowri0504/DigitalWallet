const Saving = require("../models/Saving");
const Expense = require("../models/Expense");
const CartItem = require("../models/CartItem");

// @desc    Add savings
// @route   POST /api/savings
exports.addSavings = async (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount) || amount <= 0)
    return res.status(400).json({ message: "Invalid savings amount" });

  try {
    const saving = await Saving.create({ userId: req.userId, amount });
    res.status(201).json({ message: "Savings saved successfully!", saving });
  } catch (err) {
    res.status(500).json({ message: "Error saving savings", error: err.message });
  }
};

// @desc    Add expense
// @route   POST /api/expenses
exports.addExpense = async (req, res) => {
  const { category, amount } = req.body;
  if (!category || !amount || isNaN(amount) || amount <= 0)
    return res.status(400).json({ message: "Invalid expense data" });

  try {
    const expense = await Expense.create({ userId: req.userId, category, amount });
    res.status(201).json({ message: "Expense added successfully!", expense });
  } catch (err) {
    res.status(500).json({ message: "Error saving expense", error: err.message });
  }
};

// @desc    Save cart items
// @route   POST /api/cart
exports.saveCart = async (req, res) => {
  const cartItems = req.body;

  if (!Array.isArray(cartItems) || cartItems.length === 0)
    return res.status(400).json({ message: "No cart data provided" });

  try {
    const savedItems = await CartItem.insertMany(cartItems);
    res.status(201).json({ message: "Cart saved successfully!", count: savedItems.length });
  } catch (err) {
    res.status(500).json({ message: "Error saving cart data", error: err.message });
  }
};

// @desc    Get user spending (for dashboard)
// @route   GET /api/spending
exports.getSpending = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });
    
    // Group by category
    const grouped = expenses.reduce((acc, curr) => {
      const found = acc.find(item => item.name === curr.category);
      if (found) {
        found.amount += curr.amount;
      } else {
        acc.push({ name: curr.category, amount: curr.amount });
      }
      return acc;
    }, []);

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: "Error fetching spending data", error: err.message });
  }
};

// @desc    Get recent transactions
// @route   GET /api/recent-transactions
exports.getRecentTransactions = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recent transactions", error: err.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Check if user owns the expense
    if (expense.userId.toString() !== req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await expense.deleteOne();
    res.json({ message: "Expense removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting expense", error: err.message });
  }
};
