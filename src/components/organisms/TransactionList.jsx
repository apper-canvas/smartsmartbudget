import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CategoryIcon from "@/components/molecules/CategoryIcon";
import transactionService from "@/services/api/transactionService";
import categoryService from "@/services/api/categoryService";

const TransactionList = ({ refresh = 0 }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, [refresh]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [transactionsData, categoriesData] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll()
      ]);
      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await transactionService.delete(id);
      setTransactions(prev => prev.filter(t => t.Id !== id));
      toast.success("Transaction deleted successfully");
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

const getCategoryDetails = (categoryName) => {
    return categories.find(cat => cat.Name === categoryName) || {
      Name: categoryName,
      name: categoryName,
      icon: "Circle",
      color: "#6B7280"
    };
  };

const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = filter === "all" || transaction.type === filter;
    const category = getCategoryDetails(transaction.category);
    const categoryMatch = categoryFilter === "all" || category.Name === categoryFilter;
    return typeMatch && categoryMatch;
  });

  if (loading) return <Loading type="transactions" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="sm:w-48"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="sm:w-48"
          >
<option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.Id} value={category.Name}>
                {category.Name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <Empty
          title="No transactions found"
          description="Start tracking your finances by adding your first transaction"
          icon="Receipt"
          actionLabel="Add Transaction"
        />
      ) : (
        <div className="space-y-4">
{filteredTransactions.map((transaction, index) => {
            const category = getCategoryDetails(transaction.category);
            
            return (
              <motion.div
                key={transaction.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <CategoryIcon category={category} />
                      
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {transaction.description}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant={transaction.type === "income" ? "success" : "danger"}
                          >
                            {transaction.type}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {category.Name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(parseISO(transaction.date), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`text-lg font-semibold ${
                        transaction.type === "income" 
                          ? "text-success-600" 
                          : "text-red-600"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"}
                        ${transaction.amount.toFixed(2)}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.Id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionList;