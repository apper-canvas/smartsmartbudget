import BudgetManager from "@/components/organisms/BudgetManager";

const Budgets = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
        <p className="text-gray-600 mt-1">Set spending limits and track your budget performance</p>
      </div>
      
      <BudgetManager />
    </div>
  );
};

export default Budgets;