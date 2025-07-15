import ApperIcon from "@/components/ApperIcon";

const CategoryIcon = ({ category, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 p-1.5",
    md: "w-10 h-10 p-2",
    lg: "w-12 h-12 p-2.5"
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7"
  };

  return (
    <div 
      className={`rounded-full flex items-center justify-center ${sizeClasses[size]}`}
      style={{ backgroundColor: category.color + "20" }}
    >
      <ApperIcon 
        name={category.icon} 
        className={iconSizes[size]}
        style={{ color: category.color }}
      />
    </div>
  );
};

export default CategoryIcon;