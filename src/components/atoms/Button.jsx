import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({
  children,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md hover:shadow-lg focus:ring-primary-500",
    secondary: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow focus:ring-primary-500",
    success: "bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white shadow-md hover:shadow-lg focus:ring-success-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg focus:ring-red-500",
    ghost: "hover:bg-gray-100 text-gray-700 focus:ring-primary-500"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <motion.button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;