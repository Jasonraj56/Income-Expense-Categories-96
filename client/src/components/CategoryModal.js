import React, { useState } from 'react';

const CategoryModal = ({ isOpen, onClose, categories = [], onAddCategory, onDeleteCategory }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState('🏷️');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [activeTab, setActiveTab] = useState('expense');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const emojiList = ['🏷️', '🛒', '🍔', '🏢', '⚡', '🚗', '🎬', '💊', '🛍️', '💼', '💻', '📈', '🏠', '🎁', '✈️', '📚'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    const exists = categories.some(
      c => c.name.toLowerCase() === name.trim().toLowerCase() && c.type === type
    );

    if (exists) {
      setError(`A ${type} category with this name already exists`);
      return;
    }

    onAddCategory({
      name: name.trim(),
      type,
      color,
      icon,
      budgetLimit: type === 'expense' ? parseFloat(budgetLimit) || 0 : 0
    });

    setName('');
    setBudgetLimit('');
    setError('');
  };

  const displayedCategories = categories.filter(c => c.type === activeTab);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏷️ Category & Budget Manager</h2>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="category-manager-grid">
          {/* Left Column: Create Category */}
          <div className="category-create-panel">
            <h3>Create New Category</h3>
            {error && <div className="alert-box error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Type</label>
                <div className="type-toggle-container">
                  <button
                    type="button"
                    className={`type-toggle-btn ${type === 'expense' ? 'active-expense' : ''}`}
                    onClick={() => setType('expense')}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    className={`type-toggle-btn ${type === 'income' ? 'active-income' : ''}`}
                    onClick={() => setType('income')}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Subscriptions, Gym, Freelance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Icon</label>
                  <div className="emoji-picker-row">
                    <span className="selected-icon-preview">{icon}</span>
                    <select
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="emoji-select"
                    >
                      {emojiList.map(em => (
                        <option key={em} value={em}>{em}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Badge Color</label>
                  <div className="color-picker-row">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="color-input"
                    />
                    <span className="color-hex">{color}</span>
                  </div>
                </div>
              </div>

              {type === 'expense' && (
                <div className="form-group">
                  <label>Monthly Budget Limit (₹) (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    placeholder="e.g. 5000"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                  />
                  <small className="help-text">Used to alert you when your expenses exceed this limit.</small>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-block">
                Add Category
              </button>
            </form>
          </div>

          {/* Right Column: Existing Categories List */}
          <div className="category-list-panel">
            <div className="category-tabs">
              <button
                className={`tab-btn ${activeTab === 'expense' ? 'active' : ''}`}
                onClick={() => setActiveTab('expense')}
              >
                Expense Categories ({categories.filter(c => c.type === 'expense').length})
              </button>
              <button
                className={`tab-btn ${activeTab === 'income' ? 'active' : ''}`}
                onClick={() => setActiveTab('income')}
              >
                Income Categories ({categories.filter(c => c.type === 'income').length})
              </button>
            </div>

            <div className="category-scroll-list">
              {displayedCategories.length === 0 ? (
                <p className="empty-text">No {activeTab} categories added yet.</p>
              ) : (
                displayedCategories.map((cat) => (
                  <div key={cat._id || cat.name} className="category-item-card">
                    <div className="category-badge-group">
                      <span
                        className="cat-pill"
                        style={{ backgroundColor: `${cat.color}15`, color: cat.color, borderColor: `${cat.color}40` }}
                      >
                        <span className="cat-icon">{cat.icon || '🏷️'}</span>
                        <span className="cat-name">{cat.name}</span>
                      </span>

                      {cat.type === 'expense' && cat.budgetLimit > 0 && (
                        <span className="budget-tag">
                          Limit: ₹{cat.budgetLimit.toLocaleString('en-IN')}/mo
                        </span>
                      )}
                    </div>

                    <button
                      className="delete-icon-btn"
                      title="Delete Category"
                      onClick={() => onDeleteCategory(cat._id || cat.name)}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;

