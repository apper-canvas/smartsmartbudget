import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({
  children,
  className = "",
  hover = false,
  ...props
}, ref) => {
  const baseStyles = "bg-white rounded-xl shadow-soft border border-gray-100";
  const hoverStyles = hover ? "hover:shadow-medium transition-shadow duration-300" : "";

  return (
    <motion.div
      ref={ref}
      className={cn(baseStyles, hoverStyles, className)}
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = "Card";

export default Card;