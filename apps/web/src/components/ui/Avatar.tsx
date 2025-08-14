import React from "react";
import { cn } from "../../lib/utils";
import { User } from "lucide-react";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away" | "busy";
  showStatus?: boolean;
  fallback?: string;
  className?: string;
}

const avatarSizes = {
  xs: "w-6 h-6",
  sm: "w-8 h-8", 
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16"
};

const statusColors = {
  online: "bg-green-500 pulse-online",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
  busy: "bg-red-500"
};

const statusSizes = {
  xs: "w-1.5 h-1.5",
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5", 
  lg: "w-3 h-3",
  xl: "w-4 h-4"
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  status,
  showStatus = false,
  fallback,
  className
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const showImage = src && !imageError && imageLoaded;
  const showFallback = !src || imageError || !imageLoaded;

  return (
    <div className={cn("relative inline-block", className)}>
      <div className={cn(
        "rounded-full overflow-hidden bg-cambridge-blue/20 flex items-center justify-center",
        "transition-all duration-200 ease-smooth",
        avatarSizes[size]
      )}>
        {src && !imageError && (
          <img
            src={src}
            alt={alt}
            onError={handleImageError}
            onLoad={handleImageLoad}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-200",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        )}
        {showFallback && (
          <div className="w-full h-full flex items-center justify-center">
            {fallback ? (
              <span className={cn(
                "font-medium text-cambridge-blue",
                size === "xs" && "text-xs",
                size === "sm" && "text-xs", 
                size === "md" && "text-sm",
                size === "lg" && "text-base",
                size === "xl" && "text-lg"
              )}>
                {fallback.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className={cn(
                "text-cambridge-blue",
                size === "xs" && "w-3 h-3",
                size === "sm" && "w-4 h-4",
                size === "md" && "w-5 h-5", 
                size === "lg" && "w-6 h-6",
                size === "xl" && "w-8 h-8"
              )} />
            )}
          </div>
        )}
      </div>
      
      {showStatus && status && (
        <div className={cn(
          "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-bg-surface",
          statusColors[status],
          statusSizes[size]
        )} />
      )}
    </div>
  );
};