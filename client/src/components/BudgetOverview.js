import React from 'react';

const BudgetOverview = ({ categories = [], transactions = [] }) => {
  // Only look at expense categories that have a budgetLimit > 0
  const budgetedCategories = categories.filter(c => c.type === 'expense' && c.budgetLimit > 0);

  if (budgetedCategories.length === 0) {
    return (
      <div className="budget-empty-card">
        <div className="budget-empty-icon">🎯</div>
        <h4>No Category Budgets Set</h4>
        <p>Assign monthly budget limits to your expense categories to track your spending limits.</p>
      </div>
    );
  }

  // Calculate spending per category
  const spentMap = {};
  transactions.forEach(t => {
    if (t.type === 'expense') {
      spentMap[t.category] = (spentMap[t.category] || 0) + t.amount;
    }
  });

  return (
    <div className="budget-container">
      <div className="section-header">
        <div>
          <h3>Monthly Category Budgets</h3>
          <p className="subtitle">Real-time spending vs assigned category limits</p>
        </div>
      </div>

      <div className="budget-cards-grid">
        {budgetedCategories.map((cat) => {
          const spent = spentMap[cat.name] || 0;
          const limit = cat.budgetLimit;
          const percentage = Math.min(Math.round((spent / limit) * 100), 100);
          const isOver = spent > limit;

          let statusClass = 'status-safe';
          if (isOver) {
            statusClass = 'status-danger';
          } else if (percentage >= 75) {
            statusClass = 'status-warning';
          }

          return (
            <div key={cat._id || cat.name} className="budget-card">
              <div className="budget-card-header">
                <div className="budget-title-info">
                  <span className="cat-icon-lg">{cat.icon || '🏷️'}</span>
                  <div>
                    <h4 className="cat-title">{cat.name}</h4>
                    <span className="cat-limit-sub">
                      Budget: ₹{limit.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className={`budget-percent-badge ${statusClass}`}>
                  {isOver ? `Over by ₹${(spent - limit).toLocaleString('en-IN')}` : `${percentage}%`}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar-bg">
                <div
                  className={`progress-bar-fill ${statusClass}`}
                  style={{ width: `${percentage}%`, backgroundColor: isOver ? '#ef4444' : cat.color }}
                ></div>
              </div>

              <div className="budget-card-footer">
                <span className="spent-text">
                  Spent: <strong>₹{spent.toLocaleString('en-IN')}</strong>
                </span>
                <span className="remaining-text">
                  {isOver ? (
                    <span className="text-danger font-bold">Exceeded limit!</span>
                  ) : (
                    `Remaining: ₹${(limit - spent).toLocaleString('en-IN')}`
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetOverview;

