const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Transaction title is required'],
      trim: true,
      maxlength: [80, 'Title cannot exceed 80 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
      min: [0.01, 'Amount must be greater than zero']
    },
    type: {
      type: String,
      required: [true, 'Type is required (income or expense)'],
      enum: ['income', 'expense']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    categoryColor: {
      type: String,
      default: '#6366f1'
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI / Online', 'Bank Transfer'],
      default: 'UPI / Online'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [200, 'Notes cannot exceed 200 characters'],
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Indexes for high performance querying
transactionSchema.index({ date: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ category: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);

