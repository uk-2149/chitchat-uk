import React from "react";
import { cn } from "../../lib/utils";

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

export const Tabs: React.FC<TabsProps> = ({
  defaultValue = "",
  value: controlledValue,
  onValueChange,
  children,
  className
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = controlledValue ?? internalValue;
  
  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "inline-flex h-12 items-center justify-center rounded-xl bg-cambridge-blue/10 p-1",
      className
    )}>
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value: triggerValue,
  children,
  className,
  disabled = false
}) => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within Tabs");
  }

  const { value, onValueChange } = context;
  const isActive = value === triggerValue;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onValueChange(triggerValue)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2",
        "text-sm font-medium transition-all duration-200 ease-smooth",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambridge-blue",
        "disabled:pointer-events-none disabled:opacity-50",
        isActive 
          ? "bg-bg-surface text-text-primary shadow-sm" 
          : "text-text-secondary hover:text-text-primary hover:bg-cambridge-blue/5",
        className
      )}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({
  value: contentValue,
  children,
  className
}) => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within Tabs");
  }

  const { value } = context;
  
  if (value !== contentValue) {
    return null;
  }

  return (
    <div className={cn("mt-4", className)}>
      {children}
    </div>
  );
};