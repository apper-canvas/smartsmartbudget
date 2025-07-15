import ExpenseChart from "@/components/organisms/ExpenseChart";

const Charts = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
        <p className="text-gray-600 mt-1">Visualize your spending patterns and financial trends</p>
      </div>
      
      <ExpenseChart />
    </div>
  );
};

export default Charts;