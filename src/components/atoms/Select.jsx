import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({
  className = "",
  label,
  error,
  children,
  ...props
}, ref) => {
  const baseStyles = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 bg-white";
  const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(baseStyles, errorStyles, className)}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;