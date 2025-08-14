import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  onClear
}: SearchInputProps) {
  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        leftIcon={<Search className="w-4 h-4" />}
        rightIcon={
          value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              icon={<X className="w-4 h-4" />}
              className="p-1 h-auto"
            />
          )
        }
        className={className}
        variant="filled"
      />
    </div>
  );
}