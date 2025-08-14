import React from "react";
import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text",
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = "default",
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={cn(
              "w-full px-4 py-3 rounded-xl border transition-all duration-200 ease-smooth",
              "placeholder:text-text-tertiary text-text-primary",
              "focus:outline-none focus:ring-2 focus:ring-cambridge-blue focus:border-cambridge-blue",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              variant === "default" && "bg-bg-surface border-border-secondary",
              variant === "filled" && "bg-cambridge-blue/5 border-transparent",
              error && "border-light-coral focus:ring-light-coral focus:border-light-coral",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-light-coral">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-text-tertiary">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";