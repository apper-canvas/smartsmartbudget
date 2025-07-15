import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  icon = "Database",
  action,
  actionLabel = "Add Item"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      
      {action && (
        <Button
          onClick={action}
          variant="primary"
          size="lg"
          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transform hover:scale-105 transition-all duration-200"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;