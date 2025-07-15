import { motion } from "framer-motion";

const ProgressBar = ({ value, max, color = "primary", label, showPercentage = true }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600",
    success: "bg-gradient-to-r from-success-500 to-success-600",
    warning: "bg-gradient-to-r from-amber-500 to-amber-600",
    danger: "bg-gradient-to-r from-red-500 to-red-600"
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-600">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;