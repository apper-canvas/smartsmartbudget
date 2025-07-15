import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Modal from "@/components/atoms/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ProgressBar from "@/components/molecules/ProgressBar";
import savingsGoalService from "@/services/api/savingsGoalService";

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [showModal, setShowModal] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: ""
  });
  const [addAmount, setAddAmount] = useState("");

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    setError("");
    try {
      const goalsData = await savingsGoalService.getAll();
      setGoals(goalsData);
    } catch (err) {
      setError("Failed to load savings goals");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(formData.targetAmount) <= 0) {
      toast.error("Target amount must be greater than 0");
      return;
    }

    try {
      const newGoal = await savingsGoalService.create({
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        deadline: formData.deadline
      });
      
setGoals(prev => [...prev, newGoal]);
      setFormData({ name: "", targetAmount: "", currentAmount: "", deadline: "" });
      setShowModal(false);
      toast.success("Savings goal created successfully!");
    } catch (error) {
      toast.error("Failed to create savings goal");
    }
  };

  const handleAddMoney = async (goalId) => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const updatedGoal = await savingsGoalService.addToGoal(goalId, parseFloat(addAmount));
      setGoals(prev => prev.map(g => g.Id === goalId ? updatedGoal : g));
      setAddAmount("");
      setShowAddMoney(null);
      toast.success("Amount added to savings goal!");
    } catch (error) {
      toast.error("Failed to add money to goal");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this savings goal?")) {
      return;
    }

    try {
      await savingsGoalService.delete(id);
      setGoals(prev => prev.filter(g => g.Id !== id));
      toast.success("Savings goal deleted successfully");
    } catch (error) {
      toast.error("Failed to delete savings goal");
    }
  };

  const getProgressColor = (current, target) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return "success";
    if (percentage >= 75) return "primary";
    if (percentage >= 50) return "warning";
    return "danger";
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = parseISO(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadGoals} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
<Button onClick={() => setShowModal(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

{/* Goal Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Savings Goal"
        subtitle="Set up a new savings goal to track your progress"
        size="default"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Goal Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Emergency Fund"
            />

            <Input
              label="Target Amount ($)"
              type="number"
              value={formData.targetAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Current Amount ($)"
              type="number"
              value={formData.currentAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
              placeholder="0.00 (optional)"
              step="0.01"
              min="0"
            />

            <Input
              label="Target Date"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
            />
          </div>

          <div className="flex space-x-4">
            <Button type="submit">
              Create Goal
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Goals List */}
      {goals.length === 0 ? (
        <Empty
          title="No savings goals set"
          description="Create your first savings goal to start tracking your progress towards financial milestones"
          icon="Target"
action={() => setShowModal(true)}
          actionLabel="Create Goal"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => {
            const progressColor = getProgressColor(goal.currentAmount, goal.targetAmount);
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            const remaining = goal.targetAmount - goal.currentAmount;
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isCompleted = percentage >= 100;

            return (
              <motion.div
                key={goal.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-success-100' : 'bg-primary-100'
                      }`}>
                        <ApperIcon 
                          name={isCompleted ? "CheckCircle" : "Target"} 
                          className={`w-5 h-5 ${
                            isCompleted ? 'text-success-600' : 'text-primary-600'
                          }`} 
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                        <p className="text-sm text-gray-600">
                          Due {format(parseISO(goal.deadline), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(goal.Id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">
                        ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                      </span>
                    </div>

                    <ProgressBar
                      value={goal.currentAmount}
                      max={goal.targetAmount}
                      color={progressColor}
                      showPercentage={true}
                    />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Remaining</span>
                        <p className="font-semibold text-gray-900">
                          ${remaining.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Days left</span>
                        <p className={`font-semibold ${
                          daysRemaining < 0 ? 'text-red-600' : 
                          daysRemaining < 30 ? 'text-amber-600' : 'text-gray-900'
                        }`}>
                          {daysRemaining < 0 ? 'Overdue' : `${daysRemaining} days`}
                        </p>
                      </div>
                    </div>

                    {!isCompleted && (
                      <div className="pt-4 border-t border-gray-200">
                        {showAddMoney === goal.Id ? (
                          <div className="space-y-2">
                            <Input
                              type="number"
                              value={addAmount}
                              onChange={(e) => setAddAmount(e.target.value)}
                              placeholder="Amount to add"
                              step="0.01"
                              min="0"
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleAddMoney(goal.Id)}
                                className="flex-1"
                              >
                                Add
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                  setShowAddMoney(null);
                                  setAddAmount("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setShowAddMoney(goal.Id)}
                            className="w-full"
                          >
                            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                            Add Money
                          </Button>
                        )}
                      </div>
                    )}

                    {isCompleted && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-center space-x-2 text-success-600">
                          <ApperIcon name="CheckCircle" className="w-5 h-5" />
                          <span className="font-medium">Goal Completed!</span>
                        </div>
                      </div>
                    )}
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

export default SavingsGoals;