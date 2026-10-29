const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Root endpoint for API verification
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FinTrack API - Income, Expenses and Categories Management System',
    endpoints: {
      categories: '/api/categories',
      budgetStatus: '/api/categories/budget-status',
      transactions: '/api/transactions',
      summary: '/api/transactions/summary'
    },
    status: 'Running'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ success: false, message: 'Server Internal Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Income, Expenses & Categories API ready`);
  console.log(`====================================================`);
});

