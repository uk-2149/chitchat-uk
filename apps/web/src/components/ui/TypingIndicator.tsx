import React from "react";
import { cn } from "../../lib/utils";

export interface TypingIndicatorProps {
  className?: string;
  size?: "sm" | "md";
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  className,
  size = "md"
}) => {
  return (
    <div className={cn(
      "flex items-center space-x-1 px-4 py-2 rounded-2xl bg-bg-elevated border border-border-secondary",
      size === "sm" && "px-3 py-1.5",
      className
    )}>
      <div className="flex space-x-1">
        <div className={cn(
          "bg-text-tertiary rounded-full typing-dot",
          size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"
        )} />
        <div className={cn(
          "bg-text-tertiary rounded-full typing-dot",
          size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"
        )} />
        <div className={cn(
          "bg-text-tertiary rounded-full typing-dot", 
          size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"
        )} />
      </div>
      <span className={cn(
        "text-text-tertiary ml-2",
        size === "sm" ? "text-xs" : "text-sm"
      )}>
        typing...
      </span>
    </div>
  );
};