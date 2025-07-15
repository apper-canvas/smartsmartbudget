import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import TransactionForm from "@/components/organisms/TransactionForm";
import CategoryIcon from "@/components/molecules/CategoryIcon";
import ProgressBar from "@/components/molecules/ProgressBar";
import transactionService from "@/services/api/transactionService";
import budgetService from "@/services/api/budgetService";
import savingsGoalService from "@/services/api/savingsGoalService";
import categoryService from "@/services/api/categoryService";

const Dashboard = () => {
  const [data, setData] = useState({
    transactions: [],
    budgets: [],
    goals: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, [refreshTrigger]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [transactions, budgets, goals, categories] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll(),
        savingsGoalService.getAll(),
        categoryService.getAll()
      ]);
      
      setData({ transactions, budgets, goals, categories });
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowTransactionForm(false);
  };

  const getCurrentMonthTransactions = () => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    return data.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });
  };

  const getMonthlyStats = () => {
    const monthlyTransactions = getCurrentMonthTransactions();
    
    const income = monthlyTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthlyTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const savings = income - expenses;
    
    return { income, expenses, savings };
  };

  const getRecentTransactions = () => {
    return data.transactions.slice(0, 5);
  };

  const getBudgetStatus = () => {
    return data.budgets.map(budget => {
      const percentage = (budget.spent / budget.limit) * 100;
      const status = percentage >= 90 ? "danger" : percentage >= 75 ? "warning" : "success";
      
      return {
        ...budget,
        percentage,
        status
      };
    });
  };

  const getGoalProgress = () => {
    return data.goals.map(goal => {
      const percentage = (goal.currentAmount / goal.targetAmount) * 100;
      return {
        ...goal,
        percentage: Math.min(percentage, 100)
      };
    });
  };

const getCategoryDetails = (categoryName) => {
    return data.categories.find(cat => cat.Name === categoryName) || {
      Name: categoryName,
      name: categoryName,
      icon: "Circle",
      color: "#6B7280"
    };
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const { income, expenses, savings } = getMonthlyStats();
  const recentTransactions = getRecentTransactions();
  const budgetStatus = getBudgetStatus();
  const goalProgress = getGoalProgress();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's your financial overview for {format(new Date(), "MMMM yyyy")}
          </p>
        </div>
        
        <Button onClick={() => setShowTransactionForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl"
          >
            <TransactionForm
              onTransactionAdded={handleTransactionAdded}
              onClose={() => setShowTransactionForm(false)}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Monthly Income"
          value={`$${income.toFixed(2)}`}
          icon="TrendingUp"
          color="success"
          trend="up"
          trendValue="+5.2%"
        />
        <StatCard
          title="Monthly Expenses"
          value={`$${expenses.toFixed(2)}`}
          icon="TrendingDown"
          color="danger"
          trend="down"
          trendValue="-2.1%"
        />
        <StatCard
          title="Net Savings"
          value={`$${savings.toFixed(2)}`}
          icon="PiggyBank"
          color={savings >= 0 ? "success" : "danger"}
          trend={savings >= 0 ? "up" : "down"}
          trendValue={savings >= 0 ? "+$200" : "-$150"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <Button variant="ghost" size="sm">
              <ApperIcon name="ExternalLink" className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Receipt" className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No transactions yet</p>
              </div>
            ) : (
              recentTransactions.map((transaction, index) => {
                const category = getCategoryDetails(transaction.category);
                
                return (
                  <motion.div
                    key={transaction.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <CategoryIcon category={category} size="sm" />
                      <div>
                        <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                        <p className="text-sm text-gray-600">{transaction.category}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${
                      transaction.type === "income" ? "text-success-600" : "text-red-600"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
        </Card>

        {/* Budget Overview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Budget Status</h2>
            <Button variant="ghost" size="sm">
              <ApperIcon name="ExternalLink" className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {budgetStatus.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="PiggyBank" className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No budgets set</p>
              </div>
            ) : (
              budgetStatus.slice(0, 4).map((budget, index) => (
                <motion.div
                  key={budget.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{budget.category}</span>
                    <span className="text-sm text-gray-600">
                      ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                    </span>
                  </div>
                  <ProgressBar
                    value={budget.spent}
                    max={budget.limit}
                    color={budget.status}
                  />
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Savings Goals */}
      {goalProgress.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Savings Goals Progress</h2>
            <Button variant="ghost" size="sm">
              <ApperIcon name="ExternalLink" className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goalProgress.slice(0, 3).map((goal, index) => (
              <motion.div
                key={goal.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-primary-50 to-secondary-50 p-4 rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <ApperIcon name="Target" className="w-5 h-5 text-primary-600" />
                  <h3 className="font-medium text-gray-900">{goal.name}</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{goal.percentage.toFixed(0)}%</span>
                  </div>
                  
                  <ProgressBar
                    value={goal.currentAmount}
                    max={goal.targetAmount}
                    color="primary"
                    showPercentage={false}
                  />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">${goal.currentAmount.toFixed(2)}</span>
                    <span className="text-gray-600">${goal.targetAmount.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;