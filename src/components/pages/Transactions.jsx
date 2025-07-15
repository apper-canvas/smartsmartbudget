import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import TransactionForm from "@/components/organisms/TransactionForm";
import TransactionList from "@/components/organisms/TransactionList";

const Transactions = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Track all your income and expenses</p>
        </div>
        
        <Button onClick={() => setShowForm(!showForm)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Transaction Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TransactionForm
            onTransactionAdded={handleTransactionAdded}
            onClose={() => setShowForm(false)}
          />
        </motion.div>
      )}

      {/* Transaction List */}
      <TransactionList refresh={refreshTrigger} />
    </div>
  );
};

export default Transactions;