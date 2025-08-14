import React from "react";
import { cn } from "../../lib/utils";
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react";

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

const toastStyles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-light-coral/10 border-light-coral/20 text-light-coral",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  info: "bg-tea-rose-red/10 border-tea-rose-red/20 text-tea-rose-red"
};

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type = "info",
  duration = 5000,
  onClose
}) => {
  const Icon = toastIcons[type];

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div className={cn(
      "flex items-start space-x-3 p-4 rounded-xl border shadow-lg",
      "animate-in slide-in-from-right-full duration-300",
      "max-w-sm w-full",
      toastStyles[type]
    )}>
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-medium text-sm mb-1">{title}</p>
        )}
        <p className="text-sm opacity-90">{message}</p>
      </div>
      
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastProps[] }> = ({ toasts }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};