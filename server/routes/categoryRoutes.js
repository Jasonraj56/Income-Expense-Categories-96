const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

// @route   GET /api/categories
// @desc    Get all categories (optionally filter by type: ?type=expense or ?type=income)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }
    const categories = await Category.find(filter).sort({ name: 1 });
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/categories/budget-status
// @desc    Get each category's budget vs actual current month spending
router.get('/budget-status', async (req, res) => {
  try {
    const expenseCategories = await Category.find({ type: 'expense' });
    
    // Calculate start and end of current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const monthlyExpenses = await Transaction.aggregate([
      {
        $match: {
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    const spentMap = {};
    monthlyExpenses.forEach(item => {
      spentMap[item._id] = item.totalSpent;
    });

    const report = expenseCategories.map(cat => {
      const spent = spentMap[cat.name] || 0;
      const budget = cat.budgetLimit || 0;
      const percentage = budget > 0 ? Math.round((spent / budget) * 100) : 0;
      const isOverBudget = budget > 0 && spent > budget;

      return {
        _id: cat._id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        budgetLimit: budget,
        spent: spent,
        remaining: Math.max(0, budget - spent),
        percentage: percentage,
        isOverBudget: isOverBudget
      };
    });

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/categories
// @desc    Create a new category
router.post('/', async (req, res) => {
  try {
    const { name, type, color, icon, budgetLimit } = req.body;

    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Please provide category name and type' });
    }

    const existing = await Category.findOne({ name: name.trim(), type });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category with this name already exists for this type' });
    }

    const category = await Category.create({
      name: name.trim(),
      type,
      color: color || '#6366f1',
      icon: icon || '🏷️',
      budgetLimit: Number(budgetLimit) || 0
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update an existing category
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

