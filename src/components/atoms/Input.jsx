import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({
  className = "",
  type = "text",
  label,
  error,
  ...props
}, ref) => {
  const baseStyles = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 bg-white placeholder-gray-400";
  const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(baseStyles, errorStyles, className)}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;