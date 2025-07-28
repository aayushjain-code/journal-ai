"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  Wallet,
  CreditCard,
  Home,
  Car,
  Building,
  PiggyBank,
  AlertCircle,
  Award,
  Target,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

interface Asset {
  id: number;
  name: string;
  type: "cash" | "bank" | "investment" | "property" | "vehicle" | "other";
  value: number;
  currency: string;
  notes: string;
  date: string;
}

interface Liability {
  id: number;
  name: string;
  type: "credit_card" | "loan" | "mortgage" | "other";
  amount: number;
  currency: string;
  notes: string;
  date: string;
}

interface Transaction {
  id: number;
  type: "income" | "expense";
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
}

interface FinancialGoal {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline?: string;
  completed: boolean;
  createdAt: string;
}

interface FinanceProps {
  entries: any[];
  goals: any[];
}

export default function Finance({ entries, goals }: FinanceProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showLiabilityForm, setShowLiabilityForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedAssets = localStorage.getItem("assets");
    const savedLiabilities = localStorage.getItem("liabilities");
    const savedTransactions = localStorage.getItem("transactions");
    const savedFinancialGoals = localStorage.getItem("financialGoals");

    if (savedAssets) setAssets(JSON.parse(savedAssets));
    if (savedLiabilities) setLiabilities(JSON.parse(savedLiabilities));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedFinancialGoals) setFinancialGoals(JSON.parse(savedFinancialGoals));
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Asset Management
  const addAsset = (asset: Omit<Asset, "id" | "date">) => {
    const newAsset: Asset = {
      ...asset,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    const updatedAssets = [...assets, newAsset];
    setAssets(updatedAssets);
    saveToStorage("assets", updatedAssets);
    toast.success("Asset added successfully!");
  };

  const deleteAsset = (assetId: number) => {
    const updatedAssets = assets.filter((asset) => asset.id !== assetId);
    setAssets(updatedAssets);
    saveToStorage("assets", updatedAssets);
    toast.success("Asset deleted!");
  };

  // Liability Management
  const addLiability = (liability: Omit<Liability, "id" | "date">) => {
    const newLiability: Liability = {
      ...liability,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    const updatedLiabilities = [...liabilities, newLiability];
    setLiabilities(updatedLiabilities);
    saveToStorage("liabilities", updatedLiabilities);
    toast.success("Liability added successfully!");
  };

  const deleteLiability = (liabilityId: number) => {
    const updatedLiabilities = liabilities.filter(
      (liability) => liability.id !== liabilityId
    );
    setLiabilities(updatedLiabilities);
    saveToStorage("liabilities", updatedLiabilities);
    toast.success("Liability deleted!");
  };

  // Transaction Management
  const addTransaction = (transaction: Omit<Transaction, "id" | "date">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveToStorage("transactions", updatedTransactions);
    toast.success("Transaction recorded!");
  };

  const deleteTransaction = (transactionId: number) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== transactionId
    );
    setTransactions(updatedTransactions);
    saveToStorage("transactions", updatedTransactions);
    toast.success("Transaction deleted!");
  };

  // Financial Goals Management
  const addFinancialGoal = (goal: Omit<FinancialGoal, "id" | "createdAt">) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updatedGoals = [...financialGoals, newGoal];
    setFinancialGoals(updatedGoals);
    saveToStorage("financialGoals", updatedGoals);
    toast.success("Financial goal added!");
  };

  const updateFinancialGoal = (
    goalId: number,
    updates: Partial<FinancialGoal>
  ) => {
    const updatedGoals = financialGoals.map((goal) =>
      goal.id === goalId ? { ...goal, ...updates } : goal
    );
    setFinancialGoals(updatedGoals);
    saveToStorage("financialGoals", updatedGoals);
    toast.success("Goal updated!");
  };

  const deleteFinancialGoal = (goalId: number) => {
    const updatedGoals = financialGoals.filter((goal) => goal.id !== goalId);
    setFinancialGoals(updatedGoals);
    saveToStorage("financialGoals", updatedGoals);
    toast.success("Goal deleted!");
  };

  // Calculations
  const getNetWorth = () => {
    const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalLiabilities = liabilities.reduce(
      (sum, liability) => sum + liability.amount,
      0
    );
    return totalAssets - totalLiabilities;
  };

  const getMonthlyIncome = () => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return transactions
      .filter((t) => t.type === "income" && new Date(t.date) >= lastMonth)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthlyExpenses = () => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return transactions
      .filter((t) => t.type === "expense" && new Date(t.date) >= lastMonth)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getGoalProgress = (goal: FinancialGoal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return Math.min(progress, 100);
  };

  const getAssetTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      cash: Wallet,
      bank: Building,
      investment: TrendingUp,
      property: Home,
      vehicle: Car,
      other: DollarSign,
    };
    const Icon = icons[type] || DollarSign;
    return <Icon className="w-5 h-5" />;
  };

  const getLiabilityTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      credit_card: CreditCard,
      loan: PiggyBank,
      mortgage: Home,
      other: AlertCircle,
    };
    const Icon = icons[type] || AlertCircle;
    return <Icon className="w-5 h-5" />;
  };

  const getAssetTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      cash: "bg-green-100 text-green-800",
      bank: "bg-blue-100 text-blue-800",
      investment: "bg-purple-100 text-purple-800",
      property: "bg-orange-100 text-orange-800",
      vehicle: "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[type] || colors.other;
  };

  const getLiabilityTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      credit_card: "bg-red-100 text-red-800",
      loan: "bg-yellow-100 text-yellow-800",
      mortgage: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[type] || colors.other;
  };

  const netWorth = getNetWorth();
  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();
  const monthlySavings = monthlyIncome - monthlyExpenses;

  // Financial Suggestions for Indian Entrepreneurs
  const getFinancialSuggestions = () => {
    const suggestions = [];

    // Emergency Fund Check
    const emergencyFund = assets
      .filter(
        (a) =>
          a.name.toLowerCase().includes("emergency") ||
          a.name.toLowerCase().includes("savings")
      )
      .reduce((sum, a) => sum + a.value, 0);
    const monthlyExpense = monthlyExpenses;
    if (emergencyFund < monthlyExpense * 6) {
      suggestions.push({
        type: "warning",
        title: "Build Emergency Fund",
        description: `You need ₹${(
          monthlyExpense * 6 -
          emergencyFund
        ).toLocaleString()} more for a 6-month emergency fund`,
        action: "Set aside 20% of income monthly",
      });
    }

    // Debt Management
    const totalDebt = liabilities.reduce((sum, l) => sum + l.amount, 0);
    const debtToIncomeRatio = totalDebt / (monthlyIncome * 12);
    if (debtToIncomeRatio > 0.4) {
      suggestions.push({
        type: "alert",
        title: "High Debt Ratio",
        description: `Your debt is ${(debtToIncomeRatio * 100).toFixed(
          1
        )}% of annual income`,
        action: "Focus on debt repayment before new investments",
      });
    }

    // Investment Opportunities
    if (monthlySavings > 50000) {
      suggestions.push({
        type: "success",
        title: "Investment Opportunity",
        description: `You're saving ₹${monthlySavings.toLocaleString()} monthly`,
        action: "Consider SIP in mutual funds or ELSS for tax benefits",
      });
    }

    // Tax Planning
    if (monthlyIncome > 100000) {
      suggestions.push({
        type: "info",
        title: "Tax Planning",
        description: "High income bracket - optimize tax deductions",
        action: "Maximize 80C, 80D, HRA, and business deductions",
      });
    }

    // Business Investment
    if (netWorth > 1000000) {
      suggestions.push({
        type: "success",
        title: "Business Expansion",
        description: "Strong financial position for business growth",
        action: "Consider business loans or equity investment",
      });
    }

    return suggestions;
  };

  const suggestions = getFinancialSuggestions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Financial Tracker
          </h2>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center"
        >
          <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Net Worth</h3>
          <p
            className={`text-3xl font-bold ${
              netWorth >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ₹{netWorth.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Income
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            ₹{monthlyIncome.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <TrendingDown className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Expenses
          </h3>
          <p className="text-3xl font-bold text-red-600">
            ₹{monthlyExpenses.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <PiggyBank className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Savings
          </h3>
          <p
            className={`text-3xl font-bold ${
              monthlySavings >= 0 ? "text-purple-600" : "text-red-600"
            }`}
          >
            ₹{monthlySavings.toLocaleString()}
          </p>
        </motion.div>
      </div>

      {/* Financial Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Financial Suggestions for Indian Entrepreneurs
          </h3>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  suggestion.type === "warning"
                    ? "bg-yellow-50 border-yellow-400"
                    : suggestion.type === "alert"
                    ? "bg-red-50 border-red-400"
                    : suggestion.type === "success"
                    ? "bg-green-50 border-green-400"
                    : "bg-blue-50 border-blue-400"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {suggestion.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {suggestion.description}
                    </p>
                    <p className="text-sm font-medium text-gray-800 mt-2">
                      💡 {suggestion.action}
                    </p>
                  </div>
                  <div
                    className={`ml-4 ${
                      suggestion.type === "warning"
                        ? "text-yellow-600"
                        : suggestion.type === "alert"
                        ? "text-red-600"
                        : suggestion.type === "success"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {suggestion.type === "warning" ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : suggestion.type === "alert" ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : suggestion.type === "success" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Award className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {["overview", "assets", "liabilities", "transactions", "goals"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Assets Breakdown
            </h3>
            <div className="space-y-3">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getAssetTypeIcon(asset.type)}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {asset.name}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getAssetTypeColor(
                          asset.type
                        )}`}
                      >
                        {asset.type}
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600">
                    ₹{asset.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Liabilities Breakdown
            </h3>
            <div className="space-y-3">
              {liabilities.map((liability) => (
                <div
                  key={liability.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getLiabilityTypeIcon(liability.type)}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {liability.name}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getLiabilityTypeColor(
                          liability.type
                        )}`}
                      >
                        {liability.type}
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-red-600">
                    ₹{liability.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Assets */}
      {activeTab === "assets" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Assets</h3>
            <button
              onClick={() => setShowAssetForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Asset
            </button>
          </div>

          {showAssetForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <AssetForm
                onSubmit={addAsset}
                onCancel={() => setShowAssetForm(false)}
              />
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getAssetTypeIcon(asset.type)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getAssetTypeColor(
                        asset.type
                      )}`}
                    >
                      {asset.type}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">
                  {asset.name}
                </h4>
                <p className="text-2xl font-bold text-green-600 mb-2">
                  ₹{asset.value.toLocaleString()}
                </p>

                {asset.notes && (
                  <p className="text-sm text-gray-600">{asset.notes}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Liabilities */}
      {activeTab === "liabilities" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Liabilities</h3>
            <button
              onClick={() => setShowLiabilityForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Liability
            </button>
          </div>

          {showLiabilityForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <LiabilityForm
                onSubmit={addLiability}
                onCancel={() => setShowLiabilityForm(false)}
              />
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liabilities.map((liability) => (
              <motion.div
                key={liability.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getLiabilityTypeIcon(liability.type)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getLiabilityTypeColor(
                        liability.type
                      )}`}
                    >
                      {liability.type}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteLiability(liability.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">
                  {liability.name}
                </h4>
                <p className="text-2xl font-bold text-red-600 mb-2">
                  ₹{liability.amount.toLocaleString()}
                </p>

                {liability.notes && (
                  <p className="text-sm text-gray-600">{liability.notes}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions */}
      {activeTab === "transactions" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Transactions
            </h3>
            <button
              onClick={() => setShowTransactionForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Transaction
            </button>
          </div>

          {showTransactionForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <TransactionForm
                onSubmit={addTransaction}
                onCancel={() => setShowTransactionForm(false)}
              />
            </motion.div>
          )}

          <div className="space-y-4">
            {transactions
              .slice()
              .reverse()
              .map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {transaction.description}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {transaction.category}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-2xl font-bold ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₹
                        {transaction.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Financial Goals */}
      {activeTab === "goals" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Financial Goals
            </h3>
            <button
              onClick={() => setShowGoalForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Goal
            </button>
          </div>

          {showGoalForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <FinancialGoalForm
                onSubmit={addFinancialGoal}
                onCancel={() => setShowGoalForm(false)}
              />
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financialGoals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-500" />
                  </div>
                  <button
                    onClick={() => deleteFinancialGoal(goal.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">
                  {goal.title}
                </h4>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      ₹{goal.currentAmount.toLocaleString()}/₹
                      {goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getGoalProgress(goal)}%` }}
                    />
                  </div>
                </div>

                {goal.deadline && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Form Components
function AssetForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (asset: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "cash",
    value: 0,
    currency: "INR",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Asset Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-field"
          placeholder="e.g., Savings Account, Investment Portfolio"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asset Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="input-field"
          >
            <option value="cash">Cash</option>
            <option value="bank">Bank Account</option>
            <option value="investment">Investment</option>
            <option value="property">Property</option>
            <option value="vehicle">Vehicle</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={formData.currency}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
            className="input-field"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Value
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.value}
          onChange={(e) =>
            setFormData({ ...formData, value: parseFloat(e.target.value) })
          }
          className="input-field"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="input-field min-h-[100px]"
          placeholder="Additional details about this asset..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Add Asset
        </button>
      </div>
    </form>
  );
}

function LiabilityForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (liability: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "credit_card",
    amount: 0,
    currency: "INR",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Liability Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-field"
          placeholder="e.g., Credit Card, Student Loan"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Liability Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="input-field"
          >
            <option value="credit_card">Credit Card</option>
            <option value="loan">Loan</option>
            <option value="mortgage">Mortgage</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={formData.currency}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
            className="input-field"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: parseFloat(e.target.value) })
          }
          className="input-field"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="input-field min-h-[100px]"
          placeholder="Additional details about this liability..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Add Liability
        </button>
      </div>
    </form>
  );
}

function TransactionForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (transaction: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    type: "expense",
    category: "",
    amount: 0,
    currency: "INR",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.category.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="input-field"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={formData.currency}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
            className="input-field"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="input-field"
          placeholder={
            formData.type === "income"
              ? "e.g., Salary, Freelance, Business"
              : "e.g., Food, Transport, Rent, EMI"
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: parseFloat(e.target.value) })
          }
          className="input-field"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input-field"
          placeholder="Brief description of the transaction"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Add Transaction
        </button>
      </div>
    </form>
  );
}

function FinancialGoalForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (goal: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: 0,
    currentAmount: 0,
    currency: "INR",
    deadline: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Goal Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input-field"
          placeholder="e.g., Emergency Fund, Home Down Payment, Business Investment"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Amount
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.currentAmount}
            onChange={(e) =>
              setFormData({
                ...formData,
                currentAmount: parseFloat(e.target.value),
              })
            }
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Amount
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.targetAmount}
            onChange={(e) =>
              setFormData({
                ...formData,
                targetAmount: parseFloat(e.target.value),
              })
            }
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={formData.currency}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
            className="input-field"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deadline (Optional)
          </label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
            className="input-field"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Add Goal
        </button>
      </div>
    </form>
  );
}
