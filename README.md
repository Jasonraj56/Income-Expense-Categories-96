# FinTrack — Income, Expenses & Category Management System

> **Web Technology Semester 5 Project**  
> **Topic:** Income, Expenses and Categories  
> **Tech Stack:** HTML5, CSS3, JavaScript (ES6+), React.js, Node.js, Express.js, MongoDB (Mongoose)

---

## 📌 Project Overview
**FinTrack** is a full-stack personal finance web application designed to track **Incomes**, manage **Expenses**, and organize finances with customizable **Categories** and **Monthly Budget Limits**.

### Key Highlights
- **Dashboard Overview:** Real-time Net Balance, Total Income, Total Expenses, and Savings Rate.
- **Categorization Engine:** Create, customize, and color-code categories for both Income and Expenses with emoji icons.
- **Budget Tracking & Alerts:** Set monthly limits on expense categories; get visual progress bars that turn yellow or red when approaching or exceeding limits.
- **Visual Analytics:** Interactive category breakdown donut charts and income vs. expense cashflow comparison.
- **Search & Filter:** Instant keyword search and filtering by Category and Type (Income/Expense).

---

## 🚀 Instant Quick Start

### Option 1: 1-Click Complete MERN Stack Launcher
Simply double-click the launcher script in the project directory:
👉 **`run-project.bat`**
- Automatically boots the **Node.js + MongoDB Atlas backend** on `http://localhost:5000`
- Automatically boots the **React.js frontend** on `http://localhost:3000` and opens it in your browser!

---

### Option 2: Standalone Browser Preview (Zero Installation)
If you just want to preview or present the website in Chrome without running servers:
1. Double-click **`live-preview.html`** in your project folder.
2. It opens directly in Google Chrome / Microsoft Edge with the full interactive dashboard and sample ₹ data pre-loaded!

---

## 🛠️ Complete MERN Stack Setup Guide

### Prerequisites
1. **Node.js**: Download and install from [nodejs.org](https://nodejs.org/) (LTS recommended).
2. **MongoDB Community Server**: Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) or use a free cloud cluster from [MongoDB Atlas](https://www.mongodb.com/atlas).

---

### Step 1: Backend Setup (Node.js & MongoDB)
Open a terminal in the project directory:

```bash
# Navigate to the server folder
cd "c:\Users\HP\Documents\SEM 5\WEB PR\server"

# Install backend dependencies
npm install

# (Optional) Seed initial categories and sample transactions into MongoDB
npm run seed

# Start the Node.js Express server
npm start
```
The backend API will run at: **`http://localhost:5000`**

---

### Step 2: Frontend Setup (React.js)
Open a second terminal window:

```bash
# Navigate to the client folder
cd "c:\Users\HP\Documents\SEM 5\WEB PR\client"

# Install React dependencies
npm install

# Start the React development server
npm start
```
The React frontend will automatically open at: **`http://localhost:3000`**

---

## 📂 Project Architecture

```
WEB PR/
├── live-preview.html              # Standalone instant browser demo (zero install)
├── README.md                      # Documentation & Viva Q&A
├── server/                        # Node.js + Express + MongoDB Backend
│   ├── package.json               # Backend dependencies
│   ├── server.js                  # Main server entry point & middleware
│   ├── .env                       # Environment configuration (PORT, MONGO_URI)
│   ├── seed.js                    # Database seeder with sample data
│   ├── config/
│   │   └── db.js                  # MongoDB Mongoose connection handler
│   ├── models/
│   │   ├── Category.js            # Category schema (type, icon, color, budgetLimit)
│   │   └── Transaction.js         # Transaction schema (type, amount, date, method)
│   └── routes/
│       ├── categoryRoutes.js      # Category CRUD & monthly budget aggregation
│       └── transactionRoutes.js   # Transaction CRUD & metrics summary
└── client/                        # React.js Frontend
    ├── package.json               # Frontend dependencies
    ├── public/
    │   └── index.html             # HTML5 template
    └── src/
        ├── index.js               # React 18 DOM mount
        ├── App.js                 # Main state, filtering & layout
        ├── App.css                # Custom responsive CSS design system
        ├── index.css              # Global styles & CSS variables
        ├── services/
        │   └── api.js             # API connector with localStorage fallback
        └── components/
            ├── Navbar.js          # App header & action triggers
            ├── StatCards.js       # Balance, Income, Expenses, Savings rate
            ├── AnalyticsCharts.js # Donut chart & Cashflow comparison
            ├── BudgetOverview.js  # Category budget progress & warning indicators
            ├── TransactionTable.js# Filterable table with search & deletion
            ├── TransactionModal.js# Add income / expense dialog
            └── CategoryModal.js   # Category management & budget settings
```

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | Retrieve all categories (filter with `?type=expense`) |
| `POST` | `/api/categories` | Create a new category with icon, color, and budget |
| `DELETE` | `/api/categories/:id` | Delete a category |
| `GET` | `/api/categories/budget-status`| Get current month spending vs budget limits |
| `GET` | `/api/transactions` | Get transactions (filter by `type`, `category`, `search`)|
| `GET` | `/api/transactions/summary`| Get totals for income, expense, balance, and breakdown|
| `POST` | `/api/transactions` | Add a new Income or Expense record |
| `DELETE` | `/api/transactions/:id` | Delete a transaction record |

---

## 🎓 Viva Voce & Technical Defense Q&A

**Q1: Why did you choose MongoDB for this project?**  
*Answer:* MongoDB is a document-oriented NoSQL database that stores data in JSON-like BSON documents. Transactions and categories naturally map to flexible document structures without needing rigid relational schema migrations when adding custom metadata (like colors, emojis, and payment methods).

**Q2: What is the role of Mongoose in Node.js?**  
*Answer:* Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides schema validation, type casting, default values, and query building to ensure data integrity.

**Q3: How does category budget tracking work in the backend?**  
*Answer:* Using MongoDB's Aggregation Framework (`$match` for the current month and `$group` by category name with `$sum` of amount), we calculate total spent per category and compare it against the category's `budgetLimit`.

**Q4: How is React state managed in this application?**  
*Answer:* The application uses React Hooks: `useState` for transactions, categories, active filters, and modal visibility; `useEffect` for data loading; and `useMemo` for derived metrics like net balance and filtered search results to prevent unnecessary recalculations.

