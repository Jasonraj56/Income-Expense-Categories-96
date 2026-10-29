import React from 'react';

const AnalyticsCharts = ({ transactions = [], categories = [] }) => {
  // Aggregate expenses by category
  const expenseCatMap = {};
  let totalExpense = 0;
  let totalIncome = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      totalExpense += tx.amount;
      expenseCatMap[tx.category] = (expenseCatMap[tx.category] || 0) + tx.amount;
    } else {
      totalIncome += tx.amount;
    }
  });

  const categoryBreakdown = Object.keys(expenseCatMap)
    .map((name) => {
      const catObj = categories.find((c) => c.name === name);
      const val = expenseCatMap[name];
      const percent = totalExpense > 0 ? (val / totalExpense) * 100 : 0;
      return {
        name,
        amount: val,
        percentage: percent.toFixed(1),
        color: catObj ? catObj.color : '#6366f1',
        icon: catObj ? catObj.icon : '🏷️'
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // Calculate SVG donut stroke offsets
  let cumulativePercent = 0;
  const donutSegments = categoryBreakdown.map((item) => {
    const strokeDasharray = `${item.percentage} ${100 - item.percentage}`;
    const strokeDashoffset = -cumulativePercent;
    cumulativePercent += parseFloat(item.percentage);
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset
    };
  });

  const maxBarValue = Math.max(totalIncome, totalExpense, 1);
  const incomeBarHeight = Math.round((totalIncome / maxBarValue) * 100);
  const expenseBarHeight = Math.round((totalExpense / maxBarValue) * 100);

  return (
    <div className="analytics-grid">
      {/* Category Expense Breakdown */}
      <div className="analytics-card">
        <div className="card-header-chart">
          <div>
            <h3>Expense Breakdown by Category</h3>
            <p className="subtitle">Where your money is going</p>
          </div>
          <span className="badge-tag">Total: ₹{totalExpense.toLocaleString('en-IN')}</span>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div className="chart-empty">No expense records yet to display breakdown.</div>
        ) : (
          <div className="donut-and-legend">
            <div className="donut-wrapper">
              <svg viewBox="0 0 42 42" className="donut-chart">
                <circle
                  className="donut-hole"
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="#fff"
                />
                <circle
                  className="donut-ring"
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="4"
                />
                {donutSegments.map((segment, index) => (
                  <circle
                    key={index}
                    className="donut-segment"
                    cx="21"
                    cy="21"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke={segment.color}
                    strokeWidth="4"
                    strokeDasharray={segment.strokeDasharray}
                    strokeDashoffset={segment.strokeDashoffset}
                  />
                ))}
              </svg>
              <div className="donut-center-text">
                <span className="donut-center-amount">₹{totalExpense.toLocaleString('en-IN')}</span>
                <span className="donut-center-label">Expenses</span>
              </div>
            </div>

            {/* Legend */}
            <div className="chart-legend-list">
              {categoryBreakdown.slice(0, 6).map((cat) => (
                <div key={cat.name} className="legend-item">
                  <div className="legend-left">
                    <span className="legend-dot" style={{ backgroundColor: cat.color }}></span>
                    <span className="legend-name">
                      {cat.icon} {cat.name}
                    </span>
                  </div>
                  <div className="legend-right">
                    <span className="legend-amount">₹{cat.amount.toLocaleString('en-IN')}</span>
                    <span className="legend-percent">{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cashflow Comparison: Income vs Expenses */}
      <div className="analytics-card">
        <div className="card-header-chart">
          <div>
            <h3>Cashflow Comparison</h3>
            <p className="subtitle">Income vs Expenses ratio</p>
          </div>
          <span className="badge-tag">
            Net: ₹{(totalIncome - totalExpense).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bar-comparison-container">
          <div className="bar-col">
            <div className="bar-track">
              <div
                className="bar-fill bar-fill-income"
                style={{ height: `${incomeBarHeight}%` }}
              >
                <span className="bar-tooltip">₹{totalIncome.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <span className="bar-label">Total Income</span>
            <span className="bar-val text-income">+₹{totalIncome.toLocaleString('en-IN')}</span>
          </div>

          <div className="bar-col">
            <div className="bar-track">
              <div
                className="bar-fill bar-fill-expense"
                style={{ height: `${expenseBarHeight}%` }}
              >
                <span className="bar-tooltip">₹{totalExpense.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <span className="bar-label">Total Expense</span>
            <span className="bar-val text-expense">-₹{totalExpense.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="cashflow-summary-footer">
          <div className="cashflow-pill">
            <span>Net Ratio: </span>
            <strong>
              {totalIncome > 0
                ? `${Math.round(((totalIncome - totalExpense) / totalIncome) * 100)}% Retained`
                : '0%'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;

