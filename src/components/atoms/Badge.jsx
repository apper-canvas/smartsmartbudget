import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({
  children,
  className = "",
  variant = "default",
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    success: "bg-success-100 text-success-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800"
  };

  return (
    <span
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;