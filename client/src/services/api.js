const API_BASE_URL = 'http://localhost:5000/api';

// Initial seed categories for offline/demo fallback (Rupees ₹)
const INITIAL_CATEGORIES = [
  { _id: 'cat-1', name: 'Salary', type: 'income', color: '#10b981', icon: '💼', budgetLimit: 0 },
  { _id: 'cat-2', name: 'Freelance & Side Gigs', type: 'income', color: '#06b6d4', icon: '💻', budgetLimit: 0 },
  { _id: 'cat-3', name: 'Investments', type: 'income', color: '#3b82f6', icon: '📈', budgetLimit: 0 },
  { _id: 'cat-4', name: 'Housing & Rent', type: 'expense', color: '#ef4444', icon: '🏢', budgetLimit: 18000 },
  { _id: 'cat-5', name: 'Groceries & Food', type: 'expense', color: '#f59e0b', icon: '🛒', budgetLimit: 8000 },
  { _id: 'cat-6', name: 'Dining & Cafes', type: 'expense', color: '#f97316', icon: '🍔', budgetLimit: 3500 },
  { _id: 'cat-7', name: 'Utilities & Bills', type: 'expense', color: '#6366f1', icon: '⚡', budgetLimit: 3000 },
  { _id: 'cat-8', name: 'Transportation', type: 'expense', color: '#14b8a6', icon: '🚗', budgetLimit: 2500 },
  { _id: 'cat-9', name: 'Entertainment', type: 'expense', color: '#a855f7', icon: '🎬', budgetLimit: 2000 }
];

const INITIAL_TRANSACTIONS = [
  {
    _id: 'tx-1',
    title: 'Monthly Tech Job Salary',
    amount: 65000,
    type: 'income',
    category: 'Salary',
    categoryColor: '#10b981',
    paymentMethod: 'Bank Transfer',
    notes: 'Direct salary deposit',
    date: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    _id: 'tx-2',
    title: 'Freelance Web Design',
    amount: 18500,
    type: 'income',
    category: 'Freelance & Side Gigs',
    categoryColor: '#06b6d4',
    paymentMethod: 'UPI / Online',
    notes: 'React client project milestone',
    date: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    _id: 'tx-3',
    title: 'Apartment Monthly Rent',
    amount: 15000,
    type: 'expense',
    category: 'Housing & Rent',
    categoryColor: '#ef4444',
    paymentMethod: 'Bank Transfer',
    notes: 'Rent payment to landlord',
    date: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    _id: 'tx-4',
    title: 'Supermarket Groceries',
    amount: 5450,
    type: 'expense',
    category: 'Groceries & Food',
    categoryColor: '#f59e0b',
    paymentMethod: 'Credit Card',
    notes: 'Weekly pantry supply and vegetables',
    date: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    _id: 'tx-5',
    title: 'Electricity & High-speed Wifi',
    amount: 2350,
    type: 'expense',
    category: 'Utilities & Bills',
    categoryColor: '#6366f1',
    paymentMethod: 'UPI / Online',
    notes: 'Bills for utilities',
    date: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    _id: 'tx-6',
    title: 'Weekend Dinner Outing',
    amount: 1850,
    type: 'expense',
    category: 'Dining & Cafes',
    categoryColor: '#f97316',
    paymentMethod: 'Debit Card',
    notes: 'Dinner with friends',
    date: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

// Helper: Local Storage Fallback
const getLocal = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setLocal = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('Local storage write error', err);
  }
};

// Initialize localStorage on first run
if (!localStorage.getItem('ft_categories_inr')) {
  setLocal('ft_categories_inr', INITIAL_CATEGORIES);
}
if (!localStorage.getItem('ft_transactions_inr')) {
  setLocal('ft_transactions_inr', INITIAL_TRANSACTIONS);
}

export const api = {
  // Categories API
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      if (!res.ok) throw new Error('API server down');
      const data = await res.json();
      return data.data;
    } catch {
      return getLocal('ft_categories_inr', INITIAL_CATEGORIES);
    }
  },

  async createCategory(categoryData) {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data;
    } catch {
      const cats = getLocal('ft_categories_inr', INITIAL_CATEGORIES);
      const newCat = { ...categoryData, _id: 'cat-' + Date.now() };
      cats.push(newCat);
      setLocal('ft_categories_inr', cats);
      return newCat;
    }
  },

  async deleteCategory(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      let cats = getLocal('ft_categories_inr', INITIAL_CATEGORIES);
      cats = cats.filter(c => c._id !== id);
      setLocal('ft_categories_inr', cats);
      return { success: true };
    }
  },

  // Transactions API
  async getTransactions(filters = {}) {
    const params = new URLSearchParams();
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);

    try {
      const res = await fetch(`${API_BASE_URL}/transactions?${params.toString()}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data;
    } catch {
      let txs = getLocal('ft_transactions_inr', INITIAL_TRANSACTIONS);
      if (filters.type && filters.type !== 'all') {
        txs = txs.filter(t => t.type === filters.type);
      }
      if (filters.category && filters.category !== 'all') {
        txs = txs.filter(t => t.category === filters.category);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        txs = txs.filter(t => t.title.toLowerCase().includes(query) || (t.notes && t.notes.toLowerCase().includes(query)));
      }
      return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },

  async createTransaction(txData) {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txData)
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.data;
    } catch {
      const txs = getLocal('ft_transactions_inr', INITIAL_TRANSACTIONS);
      const newTx = { ...txData, _id: 'tx-' + Date.now(), createdAt: new Date().toISOString() };
      txs.unshift(newTx);
      setLocal('ft_transactions_inr', txs);
      return newTx;
    }
  },

  async deleteTransaction(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      let txs = getLocal('ft_transactions_inr', INITIAL_TRANSACTIONS);
      txs = txs.filter(t => t._id !== id);
      setLocal('ft_transactions_inr', txs);
      return { success: true };
    }
  }
};

