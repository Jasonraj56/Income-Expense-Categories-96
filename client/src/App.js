import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatCards from './components/StatCards';
import TransactionTable from './components/TransactionTable';
import TransactionModal from './components/TransactionModal';
import CategoryModal from './components/CategoryModal';
import BudgetOverview from './components/BudgetOverview';
import AnalyticsCharts from './components/AnalyticsCharts';
import { api } from './services/api';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionModalType, setTransactionModalType] = useState('expense');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Initial Data Fetching
  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedCats, fetchedTxs] = await Promise.all([
        api.getCategories(),
        api.getTransactions()
      ]);
      setCategories(fetchedCats);
      setTransactions(fetchedTxs);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Summary Metrics Computation
  const summary = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        totalIncome += amt;
      } else {
        totalExpense += amt;
      }
    });

    const netBalance = totalIncome - totalExpense;
    const savingsRate =
      totalIncome > 0
        ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
        : 0;

    return {
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate: Math.max(0, savingsRate)
    };
  }, [transactions]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (filterType !== 'all' && tx.type !== filterType) return false;
      if (filterCategory !== 'all' && tx.category !== filterCategory) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(query);
        const matchesNotes = tx.notes && tx.notes.toLowerCase().includes(query);
        const matchesCategory = tx.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesNotes && !matchesCategory) return false;
      }
      return true;
    });
  }, [transactions, filterType, filterCategory, searchQuery]);

  // Modal Handlers
  const handleOpenTransactionModal = (type = 'expense') => {
    setTransactionModalType(type);
    setIsTransactionModalOpen(true);
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false);
  };

  const handleOpenCategoryModal = () => {
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };

  // Add Transaction
  const handleCreateTransaction = async (txData) => {
    try {
      const created = await api.createTransaction(txData);
      setTransactions((prev) => [created, ...prev]);
    } catch (err) {
      console.error('Error creating transaction:', err);
    }
  };

  // Delete Transaction
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      try {
        await api.deleteTransaction(id);
        setTransactions((prev) => prev.filter((t) => t._id !== id));
      } catch (err) {
        console.error('Error deleting transaction:', err);
      }
    }
  };

  // Add Category
  const handleAddCategory = async (catData) => {
    try {
      const newCat = await api.createCategory(catData);
      setCategories((prev) => [...prev, newCat]);
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (idOrName) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.deleteCategory(idOrName);
        setCategories((prev) => prev.filter((c) => c._id !== idOrName && c.name !== idOrName));
      } catch (err) {
        console.error('Error deleting category:', err);
      }
    }
  };

  return (
    <div className="app-layout">
      {/* Top Header & Navigation */}
      <Navbar
        onOpenTransactionModal={handleOpenTransactionModal}
        onOpenCategoryModal={handleOpenCategoryModal}
      />

      <main className="main-content">
        {/* Stat Cards Row */}
        <StatCards summary={summary} />

        {/* Charts & Visual Analytics */}
        <AnalyticsCharts
          transactions={transactions}
          categories={categories}
        />

        {/* Category Budget Tracker */}
        <BudgetOverview
          categories={categories}
          transactions={transactions}
        />

        {/* Transactions Table & Filters */}
        <TransactionTable
          transactions={filteredTransactions}
          categories={categories}
          filterType={filterType}
          setFilterType={setFilterType}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </main>

      {/* Transaction Modal (Add Income / Expense) */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={handleCloseTransactionModal}
        onSubmit={handleCreateTransaction}
        defaultType={transactionModalType}
        categories={categories}
      />

      {/* Category Manager Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <footer className="footer">
        <p>
          FinTrack &copy; {new Date().getFullYear()} — Web Technology Semester 5 Project
        </p>
        <p className="tech-badge-row">
          <span>HTML5</span>
          <span>CSS3</span>
          <span>JavaScript</span>
          <span>React.js</span>
          <span>Node.js</span>
          <span>MongoDB</span>
        </p>
      </footer>
    </div>
  );
}

export default App;

