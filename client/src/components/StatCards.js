import React from 'react';

const StatCards = ({ summary }) => {
  const { totalIncome = 0, totalExpense = 0, netBalance = 0, savingsRate = 0 } = summary;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="stats-grid">
      {/* Total Balance Card */}
      <div className={`stat-card balance-card ${netBalance >= 0 ? 'positive' : 'negative'}`}>
        <div className="stat-header">
          <span className="stat-title">Net Balance</span>
          <span className="stat-icon">{netBalance >= 0 ? '🏦' : '⚠️'}</span>
        </div>
        <div className="stat-value">{formatCurrency(netBalance)}</div>
        <div className="stat-badge">
          {netBalance >= 0 ? '✓ In Profit / Safe Reserve' : '! Negative Reserve'}
        </div>
      </div>

      {/* Total Income Card */}
      <div className="stat-card income-card">
        <div className="stat-header">
          <span className="stat-title">Total Income</span>
          <span className="stat-icon">📈</span>
        </div>
        <div className="stat-value text-income">+{formatCurrency(totalIncome)}</div>
        <div className="stat-badge text-income">
          Incoming Cashflow
        </div>
      </div>

      {/* Total Expense Card */}
      <div className="stat-card expense-card">
        <div className="stat-header">
          <span className="stat-title">Total Expenses</span>
          <span className="stat-icon">📉</span>
        </div>
        <div className="stat-value text-expense">-{formatCurrency(totalExpense)}</div>
        <div className="stat-badge text-expense">
          Total Outflows
        </div>
      </div>

      {/* Savings Rate Card */}
      <div className="stat-card savings-card">
        <div className="stat-header">
          <span className="stat-title">Savings Rate</span>
          <span className="stat-icon">🎯</span>
        </div>
        <div className="stat-value text-purple">{savingsRate}%</div>
        <div className="stat-badge">
          {savingsRate >= 20 ? '🌟 Excellent Healthy Ratio' : '💡 Aim for 20%+ target'}
        </div>
      </div>
    </div>
  );
};

export default StatCards;

