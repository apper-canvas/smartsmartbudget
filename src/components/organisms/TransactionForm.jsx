import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import transactionService from "@/services/api/transactionService";
import categoryService from "@/services/api/categoryService";
import budgetService from "@/services/api/budgetService";

const TransactionForm = ({ onTransactionAdded, onClose }) => {
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0]
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, [formData.type]);

  const loadCategories = async () => {
    try {
      const allCategories = await categoryService.getAll();
      const filteredCategories = allCategories.filter(cat => cat.type === formData.type);
      setCategories(filteredCategories);
      
      // Reset category selection when type changes
      if (formData.category && !filteredCategories.find(cat => cat.name === formData.category)) {
        setFormData(prev => ({ ...prev, category: "" }));
      }
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Please enter a description";
    }
    
    if (!formData.date) {
      newErrors.date = "Please select a date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      const newTransaction = await transactionService.create(transactionData);
      
      // Update budget if it's an expense
      if (formData.type === "expense") {
        await budgetService.updateSpent(formData.category, parseFloat(formData.amount));
      }
      
      toast.success("Transaction added successfully!");
      
      if (onTransactionAdded) {
        onTransactionAdded(newTransaction);
      }
      
      // Reset form
      setFormData({
        amount: "",
        type: "expense",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0]
      });
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast.error("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Add Transaction</h2>
        {onClose && (
          <Button variant="ghost" onClick={onClose} className="p-2">
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Amount ($)"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            error={errors.amount}
          />

          <Select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            error={errors.type}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            error={errors.category}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.Id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>

          <Input
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            error={errors.date}
          />
        </div>

        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter transaction description"
          error={errors.description}
        />

        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Transaction
              </>
            )}
          </Button>
          
          {onClose && (
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default TransactionForm;