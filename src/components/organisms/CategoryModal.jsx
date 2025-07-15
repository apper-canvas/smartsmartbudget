import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import categoryService from "@/services/api/categoryService";

const CategoryModal = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    icon: "Tag",
    color: "#3B82F6"
  });
  const [formErrors, setFormErrors] = useState({});

  const iconOptions = [
    "Tag", "UtensilsCrossed", "Car", "Film", "ShoppingBag", "Receipt",
    "Heart", "GraduationCap", "Plane", "Home", "Sparkles", "DollarSign",
    "Briefcase", "TrendingUp", "Plus", "Coffee", "Music", "Gamepad2",
    "Book", "Dumbbell", "Shirt", "Zap", "Fuel", "Building"
  ];

  const colorOptions = [
    "#3B82F6", "#8B5CF6", "#EC4899", "#EF4444", "#F59E0B",
    "#10B981", "#06B6D4", "#F97316", "#84CC16", "#A855F7"
  ];

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories");
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.icon) errors.icon = "Icon is required";
    if (!formData.color) errors.color = "Color is required";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      
      if (editingCategory) {
        await categoryService.update(editingCategory.Id, formData);
        toast.success("Category updated successfully");
      } else {
        await categoryService.create(formData);
        toast.success("Category created successfully");
      }
      
      await loadCategories();
      handleCloseForm();
    } catch (err) {
      toast.error(editingCategory ? "Failed to update category" : "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      setLoading(true);
      await categoryService.delete(categoryId);
      await loadCategories();
      setDeleteConfirm(null);
      toast.success("Category deleted successfully");
    } catch (err) {
      toast.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      type: "expense",
      icon: "Tag",
      color: "#3B82F6"
    });
    setFormErrors({});
  };

  const handleClose = () => {
    handleCloseForm();
    setDeleteConfirm(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Settings" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Category Management</h2>
                <p className="text-sm text-gray-600">Manage your expense and income categories</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {error ? (
              <Error message={error} onRetry={loadCategories} />
            ) : loading && categories.length === 0 ? (
              <Loading />
            ) : (
              <>
                {/* Add Category Button */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                    <Badge variant="primary">{categories.length} Categories</Badge>
                  </div>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="flex items-center space-x-2"
                    disabled={loading}
                  >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    <span>Add Category</span>
                  </Button>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <Card key={category.Id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: category.color + '20' }}
                          >
                            <ApperIcon 
                              name={category.icon} 
                              className="w-5 h-5"
                              style={{ color: category.color }}
                            />
                          </div>
                          <div>
<h3 className="font-medium text-gray-900">{category.Name}</h3>
                            <Badge 
                              variant={category.type === 'income' ? 'success' : 'default'}
                              className="text-xs"
                            >
                              {category.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                          className="flex-1"
                          disabled={loading}
                        >
                          <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirm(category)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                          disabled={loading}
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
              onClick={handleCloseForm}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {editingCategory ? 'Edit Category' : 'Add Category'}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ApperIcon name="X" className="w-5 h-5" />
                    </Button>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category Name
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter category name"
                        error={formErrors.name}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <Select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon
                      </label>
                      <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto border rounded-lg p-2">
                        {iconOptions.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon })}
                            className={`p-2 rounded-lg border-2 transition-colors ${
                              formData.icon === icon
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <ApperIcon name={icon} className="w-4 h-4" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setFormData({ ...formData, color })}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${
                              formData.color === color
                                ? 'border-gray-800 scale-110'
                                : 'border-gray-200 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCloseForm}
                        className="flex-1"
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={loading}
                      >
                        {loading ? (
                          <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                        ) : (
                          editingCategory ? 'Update' : 'Create'
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Trash2" className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Delete Category</h3>
                      <p className="text-sm text-gray-600">This action cannot be undone</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    Are you sure you want to delete "<strong>{deleteConfirm.name}</strong>"?
                  </p>

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleDelete(deleteConfirm.Id)}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                      ) : (
                        'Delete'
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default CategoryModal;