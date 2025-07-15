import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ProgressBar from "@/components/molecules/ProgressBar";
import CategoryIcon from "@/components/molecules/CategoryIcon";
import budgetService from "@/services/api/budgetService";
import categoryService from "@/services/api/categoryService";

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    limit: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [budgetsData, categoriesData] = await Promise.all([
        budgetService.getAll(),
        categoryService.getAll()
      ]);
      setBudgets(budgetsData);
      setCategories(categoriesData.filter(cat => cat.type === "expense"));
    } catch (err) {
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.limit || parseFloat(formData.limit) <= 0) {
      toast.error("Please fill in all fields with valid values");
      return;
    }

    // Check if budget already exists for this category
    const existingBudget = budgets.find(b => b.category === formData.category);
    if (existingBudget) {
      toast.error("Budget already exists for this category");
      return;
    }

    try {
      const newBudget = await budgetService.create({
        category: formData.category,
        limit: parseFloat(formData.limit),
        period: "monthly"
      });
      
      setBudgets(prev => [...prev, newBudget]);
      setFormData({ category: "", limit: "" });
      setShowForm(false);
      toast.success("Budget created successfully!");
    } catch (error) {
      toast.error("Failed to create budget");
    }
  };

  const handleUpdate = async (id, newLimit) => {
    try {
      const updatedBudget = await budgetService.update(id, { limit: newLimit });
      setBudgets(prev => prev.map(b => b.Id === id ? updatedBudget : b));
      toast.success("Budget updated successfully!");
    } catch (error) {
      toast.error("Failed to update budget");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) {
      return;
    }

    try {
      await budgetService.delete(id);
      setBudgets(prev => prev.filter(b => b.Id !== id));
      toast.success("Budget deleted successfully");
    } catch (error) {
      toast.error("Failed to delete budget");
    }
  };

  const getCategoryDetails = (categoryName) => {
    return categories.find(cat => cat.name === categoryName) || {
      name: categoryName,
      icon: "Circle",
      color: "#6B7280"
    };
  };

  const getProgressColor = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 90) return "danger";
    if (percentage >= 75) return "warning";
    return "success";
  };

  const availableCategories = categories.filter(
    cat => !budgets.find(budget => budget.category === cat.name)
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {/* Budget Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Budget</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Select category</option>
                {availableCategories.map((category) => (
                  <option key={category.Id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Select>

              <Input
                label="Monthly Limit ($)"
                type="number"
                value={formData.limit}
                onChange={(e) => setFormData(prev => ({ ...prev, limit: e.target.value }))}
                placeholder="0.00"
                step="0.01"
                min="0"
              />

              <div className="flex items-end space-x-2">
                <Button type="submit" className="flex-1">
                  Create Budget
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Budget List */}
      {budgets.length === 0 ? (
        <Empty
          title="No budgets set"
          description="Create your first budget to start tracking your spending limits"
          icon="PiggyBank"
          action={() => setShowForm(true)}
          actionLabel="Create Budget"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget, index) => {
            const category = getCategoryDetails(budget.category);
            const progressColor = getProgressColor(budget.spent, budget.limit);
            const remaining = Math.max(0, budget.limit - budget.spent);
            const isOverBudget = budget.spent > budget.limit;

            return (
              <motion.div
                key={budget.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <CategoryIcon category={category} />
                      <div>
                        <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                        <p className="text-sm text-gray-600">Monthly Budget</p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(budget.Id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Spent</span>
                      <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                        ${budget.spent.toFixed(2)}
                      </span>
                    </div>

                    <ProgressBar
                      value={budget.spent}
                      max={budget.limit}
                      color={progressColor}
                      showPercentage={true}
                    />

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {isOverBudget ? "Over budget" : "Remaining"}
                      </span>
                      <span className={isOverBudget ? "text-red-600 font-semibold" : "text-success-600 font-semibold"}>
                        {isOverBudget ? "-" : ""}${Math.abs(remaining).toFixed(2)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Budget Limit</span>
                        <span className="font-semibold text-gray-900">
                          ${budget.limit.toFixed(2)}
                        </span>
                      </div>
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

export default BudgetManager;