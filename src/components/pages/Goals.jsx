import SavingsGoals from "@/components/organisms/SavingsGoals";

const Goals = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
        <p className="text-gray-600 mt-1">Set and track your financial goals and milestones</p>
      </div>
      
      <SavingsGoals />
    </div>
  );
};

export default Goals;