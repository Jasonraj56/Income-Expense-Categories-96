const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// @route   GET /api/transactions
// @desc    Get transactions with optional filters (type, category, search, startDate, endDate)
router.get('/', async (req, res) => {
  try {
    const { type, category, search, startDate, endDate, limit = 100 } = req.query;
    const filter = {};

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .limit(Number(limit));

    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/transactions/summary
// @desc    Get dashboard metrics (Total Income, Total Expense, Net Balance, Savings Rate, Category Split)
router.get('/summary', async (req, res) => {
  try {
    const transactions = await Transaction.find({});

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryExpenseMap = {};
    const categoryIncomeMap = {};

    transactions.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        totalIncome += amt;
        categoryIncomeMap[tx.category] = (categoryIncomeMap[tx.category] || 0) + amt;
      } else {
        totalExpense += amt;
        categoryExpenseMap[tx.category] = (categoryExpenseMap[tx.category] || 0) + amt;
      }
    });

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

    // Convert category map to array for frontend charts
    const expenseBreakdown = Object.keys(categoryExpenseMap).map(catName => ({
      name: catName,
      value: categoryExpenseMap[catName],
      percentage: totalExpense > 0 ? Math.round((categoryExpenseMap[catName] / totalExpense) * 100) : 0
    })).sort((a, b) => b.value - a.value);

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netBalance,
        savingsRate: Math.max(0, savingsRate),
        transactionCount: transactions.length,
        expenseBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/transactions
// @desc    Add a new transaction (Income or Expense)
router.post('/', async (req, res) => {
  try {
    const { title, amount, type, category, date, paymentMethod, notes } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, amount, type (income/expense), and category'
      });
    }

    // Try finding the category color for consistent visual UI
    const catDoc = await Category.findOne({ name: category });
    const categoryColor = catDoc ? catDoc.color : '#6366f1';

    const transaction = await Transaction.create({
      title: title.trim(),
      amount: Number(amount),
      type,
      category: category.trim(),
      categoryColor,
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'UPI / Online',
      notes: notes ? notes.trim() : ''
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update an existing transaction
router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

