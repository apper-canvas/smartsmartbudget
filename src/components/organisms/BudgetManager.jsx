import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Modal from "@/components/atoms/Modal";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import ProgressBar from "@/components/molecules/ProgressBar";
import CategoryIcon from "@/components/molecules/CategoryIcon";
import categoryService from "@/services/api/categoryService";
import budgetService from "@/services/api/budgetService";
const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
const existingBudget = budgets.find(b => {
      const budgetCategory = typeof b.category === 'object' && b.category?.Name ? b.category.Name : b.category;
      return budgetCategory === formData.category;
    });
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
      setIsModalOpen(false);
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
    // Handle both string and object category formats
    const categoryKey = typeof categoryName === 'object' && categoryName?.Name ? categoryName.Name : categoryName;
    
    // Find category in mock data (uses "name" property) or database format (uses "Name" property)
    const foundCategory = categories.find(cat => cat.Name === categoryKey || cat.name === categoryKey);
    
    if (foundCategory) {
      // Ensure consistent structure with string values for safe React rendering
      return {
        Id: foundCategory.Id,
        Name: String(foundCategory.Name || foundCategory.name || 'Unknown'),
        name: String(foundCategory.name || foundCategory.Name || 'Unknown'),
        icon: String(foundCategory.icon || "Circle"),
        color: String(foundCategory.color || "#6B7280"),
        type: String(foundCategory.type || 'expense')
      };
    }
    
    // Fallback for unknown categories - ensure string values for safe rendering
    return {
      Id: null,
      Name: String(categoryKey || 'Unknown'),
      name: String(categoryKey || 'Unknown'),
      icon: "Circle",
      color: "#6B7280",
      type: "expense"
    };
  };

  const getProgressColor = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 90) return "danger";
    if (percentage >= 75) return "warning";
    return "success";
  };

const availableCategories = categories.filter(
    cat => !budgets.find(budget => {
      const budgetCategory = getCategoryDetails(budget.category);
      return budgetCategory.Name === cat.Name;
    })
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
{/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {/* Budget Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Budget"
        size="default"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">Select category</option>
{availableCategories.map((category) => (
              <option key={category.Id} value={category.Name}>
                {category.Name}
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Budget
            </Button>
          </div>
        </form>
      </Modal>

      {/* Budget List */}
      {budgets.length === 0 ? (
        <Empty
          title="No budgets set"
          description="Create your first budget to start tracking your spending limits"
          icon="PiggyBank"
          action={() => setIsModalOpen(true)}
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
                        <h3 className="font-semibold text-gray-900">{category.Name}</h3>
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