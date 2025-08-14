import React from "react";
import { cn } from "../../lib/utils";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "glass";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const cardVariants = {
  default: "bg-bg-surface border border-border-secondary",
  elevated: "bg-bg-elevated shadow-lg border border-border-secondary",
  glass: "glass-effect"
};

const cardPadding = {
  none: "",
  sm: "p-4",
  md: "p-6", 
  lg: "p-8"
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
  padding = "md",
  hover = false
}) => {
  return (
    <div className={cn(
      "rounded-xl transition-all duration-200 ease-smooth",
      cardVariants[variant],
      cardPadding[padding],
      hover && "hover:shadow-lg hover:scale-[1.02] cursor-pointer",
      className
    )}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn("mb-4", className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <h3 className={cn("text-lg font-semibold text-text-primary", className)}>
    {children}
  </h3>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn("text-text-secondary", className)}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn("mt-4 pt-4 border-t border-border-secondary", className)}>
    {children}
  </div>
);