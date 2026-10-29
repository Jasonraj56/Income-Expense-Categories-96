import React from 'react';

const Navbar = ({ onOpenTransactionModal, onOpenCategoryModal }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand">
          <div className="brand-icon">💰</div>
          <div className="brand-text">
            <h1>FinTrack</h1>
            <span className="brand-sub">Income, Expenses & Budget System</span>
          </div>
        </div>

        <div className="navbar-actions">
          <button
            className="btn btn-secondary"
            onClick={onOpenCategoryModal}
            title="Manage categories and budgets"
          >
            <span>🏷️</span> Categories
          </button>
          <button
            className="btn btn-income"
            onClick={() => onOpenTransactionModal('income')}
          >
            <span>+</span> Add Income
          </button>
          <button
            className="btn btn-expense"
            onClick={() => onOpenTransactionModal('expense')}
          >
            <span>−</span> Add Expense
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

