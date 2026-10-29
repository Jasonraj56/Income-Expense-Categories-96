import React, { useState, useEffect } from 'react';

const TransactionModal = ({ isOpen, onClose, onSubmit, defaultType = 'expense', categories = [] }) => {
  const [type, setType] = useState(defaultType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('UPI / Online');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Synchronize when modal opens
  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setTitle('');
      setAmount('');
      setNotes('');
      setDate(new Date().toISOString().split('T')[0]);
      setError('');
    }
  }, [isOpen, defaultType]);

  // Filter categories based on selected transaction type
  const filteredCategories = categories.filter(c => c.type === type);

  useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategory(filteredCategories[0].name);
    } else {
      setCategory('');
    }
  }, [type, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title or description');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }
    if (!category) {
      setError('Please select or create a category first');
      return;
    }

    const matchedCat = categories.find(c => c.name === category);

    onSubmit({
      title: title.trim(),
      amount: parsedAmount,
      type,
      category,
      categoryColor: matchedCat ? matchedCat.color : '#6366f1',
      date: new Date(date).toISOString(),
      paymentMethod,
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{type === 'income' ? '💰 Record New Income' : '💸 Record New Expense'}</h2>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="alert-box error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Type Switcher */}
          <div className="type-toggle-container">
            <button
              type="button"
              className={`type-toggle-btn ${type === 'income' ? 'active-income' : ''}`}
              onClick={() => setType('income')}
            >
              + Income
            </button>
            <button
              type="button"
              className={`type-toggle-btn ${type === 'expense' ? 'active-expense' : ''}`}
              onClick={() => setType('expense')}
            >
              − Expense
            </button>
          </div>

          <div className="form-group">
            <label>Title / Description *</label>
            <input
              type="text"
              placeholder="e.g. Monthly Salary, Grocery run, Utility bill"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {filteredCategories.length === 0 ? (
                  <option value="">No {type} categories found</option>
                ) : (
                  filteredCategories.map((c) => (
                    <option key={c._id || c.name} value={c.name}>
                      {c.icon || '🏷️'} {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="UPI / Online">UPI / Online</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              rows="2"
              placeholder="Additional details, invoice number, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${type === 'income' ? 'btn-income' : 'btn-expense'}`}
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;

