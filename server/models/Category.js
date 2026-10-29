const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [40, 'Category name cannot exceed 40 characters']
    },
    type: {
      type: String,
      required: [true, 'Category type must be income or expense'],
      enum: ['income', 'expense'],
      default: 'expense'
    },
    color: {
      type: String,
      default: '#6366f1' // Modern Indigo
    },
    icon: {
      type: String,
      default: '🏷️'
    },
    budgetLimit: {
      type: Number,
      default: 0,
      min: [0, 'Budget limit must be positive']
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate categories of same type
categorySchema.index({ name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);

