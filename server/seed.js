const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Transaction = require('./models/Transaction');

dotenv.config();

const defaultCategories = [
  // Income categories
  { name: 'Salary', type: 'income', color: '#10b981', icon: '💼', budgetLimit: 0 },
  { name: 'Freelance & Side Gigs', type: 'income', color: '#06b6d4', icon: '💻', budgetLimit: 0 },
  { name: 'Investments & Dividends', type: 'income', color: '#3b82f6', icon: '📈', budgetLimit: 0 },
  { name: 'Rental Income', type: 'income', color: '#8b5cf6', icon: '🏠', budgetLimit: 0 },
  { name: 'Gifts & Rewards', type: 'income', color: '#ec4899', icon: '🎁', budgetLimit: 0 },

  // Expense categories with monthly budgets in INR (₹)
  { name: 'Housing & Rent', type: 'expense', color: '#ef4444', icon: '🏢', budgetLimit: 18000 },
  { name: 'Groceries & Food', type: 'expense', color: '#f59e0b', icon: '🛒', budgetLimit: 8000 },
  { name: 'Dining & Cafes', type: 'expense', color: '#f97316', icon: '🍔', budgetLimit: 3500 },
  { name: 'Utilities & Bills', type: 'expense', color: '#6366f1', icon: '⚡', budgetLimit: 3000 },
  { name: 'Transportation & Fuel', type: 'expense', color: '#14b8a6', icon: '🚗', budgetLimit: 2500 },
  { name: 'Entertainment & Leisure', type: 'expense', color: '#a855f7', icon: '🎬', budgetLimit: 2000 },
  { name: 'Healthcare & Fitness', type: 'expense', color: '#06b6d4', icon: '💊', budgetLimit: 2500 },
  { name: 'Shopping & Apparel', type: 'expense', color: '#ec4899', icon: '🛍️', budgetLimit: 4000 }
];

const sampleTransactions = [
  {
    title: 'Monthly Tech Job Salary',
    amount: 65000,
    type: 'income',
    category: 'Salary',
    categoryColor: '#10b981',
    paymentMethod: 'Bank Transfer',
    notes: 'Direct deposit for current month',
    date: new Date(Date.now() - 10 * 86400000)
  },
  {
    title: 'Frontend Client Project',
    amount: 18500,
    type: 'income',
    category: 'Freelance & Side Gigs',
    categoryColor: '#06b6d4',
    paymentMethod: 'UPI / Online',
    notes: 'React web application milestone payment',
    date: new Date(Date.now() - 5 * 86400000)
  },
  {
    title: 'Apartment Monthly Rent',
    amount: 15000,
    type: 'expense',
    category: 'Housing & Rent',
    categoryColor: '#ef4444',
    paymentMethod: 'Bank Transfer',
    notes: 'Paid to landlord',
    date: new Date(Date.now() - 9 * 86400000)
  },
  {
    title: 'Supermarket Groceries',
    amount: 5450,
    type: 'expense',
    category: 'Groceries & Food',
    categoryColor: '#f59e0b',
    paymentMethod: 'Credit Card',
    notes: 'Weekly pantry restocking and vegetables',
    date: new Date(Date.now() - 4 * 86400000)
  },
  {
    title: 'Electricity & High-speed Wifi',
    amount: 2350,
    type: 'expense',
    category: 'Utilities & Bills',
    categoryColor: '#6366f1',
    paymentMethod: 'UPI / Online',
    notes: 'Monthly utility bills',
    date: new Date(Date.now() - 3 * 86400000)
  },
  {
    title: 'Weekend Dinner with Friends',
    amount: 1850,
    type: 'expense',
    category: 'Dining & Cafes',
    categoryColor: '#f97316',
    paymentMethod: 'Debit Card',
    notes: 'Italian bistro dinner',
    date: new Date(Date.now() - 2 * 86400000)
  },
  {
    title: 'Metro Transit Card Recharge',
    amount: 1200,
    type: 'expense',
    category: 'Transportation & Fuel',
    categoryColor: '#14b8a6',
    paymentMethod: 'UPI / Online',
    notes: 'Commute monthly pass',
    date: new Date(Date.now() - 1 * 86400000)
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/income_expense_tracker');
    console.log(' Connected to MongoDB for seeding...');

    // Clear existing
    await Category.deleteMany({});
    await Transaction.deleteMany({});
    console.log(' Cleared old data.');

    // Insert categories
    const createdCategories = await Category.insertMany(defaultCategories);
    console.log(` Successfully seeded ${createdCategories.length} categories.`);

    // Insert sample transactions
    const createdTransactions = await Transaction.insertMany(sampleTransactions);
    console.log(` Successfully seeded ${createdTransactions.length} sample transactions.`);

    console.log(' Database seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();

