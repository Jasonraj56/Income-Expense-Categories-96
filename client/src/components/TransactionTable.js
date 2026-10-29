import React from 'react';

const TransactionTable = ({
  transactions = [],
  categories = [],
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  searchQuery,
  setSearchQuery,
  onDeleteTransaction
}) => {
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amt);
  };

  return (
    <div className="transactions-card">
      <div className="transactions-toolbar">
        <div className="filter-tabs">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Transactions
          </button>
          <button
            className={`filter-btn ${filterType === 'income' ? 'active' : ''}`}
            onClick={() => setFilterType('income')}
          >
            Income Only
          </button>
          <button
            className={`filter-btn ${filterType === 'expense' ? 'active' : ''}`}
            onClick={() => setFilterType('expense')}
          >
            Expenses Only
          </button>
        </div>

        <div className="search-and-select">
          {/* Category Filter */}
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id || c.name} value={c.name}>
                {c.icon || '🏷️'} {c.name}
              </option>
            ))}
          </select>

          {/* Search Bar */}
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                &times;
              </button>
            )}
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h4>No Transactions Found</h4>
          <p>Try modifying your filters or click the Add button above to create a new record.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title / Description</th>
                <th>Category</th>
                <th>Method</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr key={tx._id || tx.title + tx.date}>
                    <td className="date-cell">{formatDate(tx.date)}</td>
                    <td className="title-cell">
                      <div className="title-text">{tx.title}</div>
                      {tx.notes && <div className="notes-subtext">{tx.notes}</div>}
                    </td>
                    <td>
                      <span
                        className="cat-badge-table"
                        style={{
                          backgroundColor: `${tx.categoryColor || '#6366f1'}18`,
                          color: tx.categoryColor || '#4f46e5',
                          borderColor: `${tx.categoryColor || '#6366f1'}40`
                        }}
                      >
                        {tx.category}
                      </span>
                    </td>
                    <td>
                      <span className="method-pill">{tx.paymentMethod || 'Online'}</span>
                    </td>
                    <td className={`amount-cell text-right ${isIncome ? 'text-income' : 'text-expense'}`}>
                      {isIncome ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                    </td>
                    <td className="text-center">
                      <button
                        className="row-delete-btn"
                        title="Delete record"
                        onClick={() => onDeleteTransaction(tx._id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;

