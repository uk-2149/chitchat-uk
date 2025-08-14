import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "ai";
  size?: "sm" | "md";
  className?: string;
}

const badgeVariants = {
  default: "bg-cambridge-blue/10 text-cambridge-blue border-cambridge-blue/20",
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  error: "bg-light-coral/10 text-light-coral border-light-coral/20",
  info: "bg-tea-rose-red/10 text-tea-rose-red border-tea-rose-red/20",
  ai: "bg-gradient-to-r from-hunyadi-yellow/10 to-tea-rose-red/10 text-hunyadi-yellow border-hunyadi-yellow/20"
};

const badgeSizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm"
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "sm", 
  className
}) => {
  return (
    <span className={cn(
      "inline-flex items-center font-medium rounded-full border transition-all duration-200",
      badgeVariants[variant],
      badgeSizes[size],
      className
    )}>
      {children}
    </span>
  );
};