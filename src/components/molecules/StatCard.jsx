import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ title, value, icon, trend, trendValue, color = "primary" }) => {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-100",
    success: "text-success-600 bg-success-100",
    warning: "text-amber-600 bg-amber-100",
    danger: "text-red-600 bg-red-100"
  };

  const trendIcon = trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus";
  const trendColor = trend === "up" ? "text-success-600" : trend === "down" ? "text-red-600" : "text-gray-600";

  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <motion.p 
            className="text-2xl font-bold text-gray-900"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.p>
          {trendValue && (
            <div className={`flex items-center mt-2 text-sm ${trendColor}`}>
              <ApperIcon name={trendIcon} className="w-4 h-4 mr-1" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <ApperIcon name={icon} className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;