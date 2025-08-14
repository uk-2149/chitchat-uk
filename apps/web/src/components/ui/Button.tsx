import React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const buttonVariants = {
  primary: "bg-hunyadi-yellow hover:bg-hunyadi-yellow/90 text-ink-900 shadow-md hover:shadow-lg",
  secondary: "bg-cambridge-blue hover:bg-cambridge-blue/90 text-white shadow-md hover:shadow-lg",
  ghost: "hover:bg-cambridge-blue/10 text-text-primary",
  destructive: "bg-light-coral hover:bg-light-coral/90 text-white shadow-md hover:shadow-lg",
  outline: "border-2 border-cambridge-blue text-cambridge-blue hover:bg-cambridge-blue hover:text-white"
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-base rounded-xl",
  lg: "px-6 py-3 text-lg rounded-xl"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "md", 
    loading = false,
    icon,
    iconPosition = "left",
    children, 
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 ease-smooth",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hunyadi-yellow focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          "active:scale-[0.98] hover:scale-[1.02]",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {!loading && icon && iconPosition === "left" && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === "right" && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";