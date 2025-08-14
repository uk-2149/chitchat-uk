import React from "react";
import { cn } from "../../lib/utils";
import { Check, CheckCheck, Clock, AlertCircle } from "lucide-react";
import { Avatar } from "./Avatar";

export interface MessageBubbleProps {
  content: string;
  timestamp: Date;
  isOwn: boolean;
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
  senderName?: string;
  senderAvatar?: string;
  showAvatar?: boolean;
  type?: "text" | "image" | "audio" | "file";
  mediaUrl?: string;
  isEdited?: boolean;
  isAI?: boolean;
  className?: string;
}

const statusIcons = {
  sending: Clock,
  sent: Check,
  delivered: CheckCheck,
  read: CheckCheck,
  failed: AlertCircle
};

const statusColors = {
  sending: "text-text-tertiary",
  sent: "text-text-tertiary", 
  delivered: "text-text-tertiary",
  read: "text-cambridge-blue",
  failed: "text-light-coral"
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  timestamp,
  isOwn,
  status = "sent",
  senderName,
  senderAvatar,
  showAvatar = false,
  type = "text",
  mediaUrl,
  isEdited = false,
  isAI = false,
  className
}) => {
  const StatusIcon = statusIcons[status];
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn(
      "flex items-end space-x-2 max-w-[80%]",
      isOwn ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto",
      className
    )}>
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <Avatar
          src={senderAvatar}
          fallback={senderName?.charAt(0)}
          size="sm"
          className="mb-1"
        />
      )}
      
      {/* Message Container */}
      <div className={cn(
        "flex flex-col",
        isOwn ? "items-end" : "items-start"
      )}>
        {/* Sender Name */}
        {!isOwn && senderName && (
          <span className="text-xs text-text-tertiary mb-1 px-1">
            {senderName}
          </span>
        )}
        
        {/* Message Bubble */}
        <div className={cn(
          "relative px-4 py-2 max-w-full break-words transition-all duration-200",
          isOwn ? "message-bubble-sent" : "message-bubble-received",
          isAI && !isOwn && "ring-2 ring-hunyadi-yellow/20 bg-gradient-to-br from-hunyadi-yellow/5 to-tea-rose-red/5"
        )}>
          {/* AI Badge */}
          {isAI && !isOwn && (
            <div className="absolute -top-2 -left-2">
              <div className="bg-hunyadi-yellow text-ink-900 text-xs px-2 py-0.5 rounded-full font-medium">
                AI
              </div>
            </div>
          )}
          
          {/* Content */}
          {type === "text" && (
            <p className="text-sm leading-relaxed">{content}</p>
          )}
          
          {type === "image" && mediaUrl && (
            <div className="space-y-2">
              <img 
                src={mediaUrl} 
                alt="Shared image"
                className="rounded-lg max-w-full h-auto"
              />
              {content && <p className="text-sm">{content}</p>}
            </div>
          )}
          
          {/* Message Footer */}
          <div className={cn(
            "flex items-center justify-end space-x-1 mt-1 text-xs",
            isOwn ? "text-ink-900/70" : "text-text-tertiary"
          )}>
            {isEdited && (
              <span className="italic">edited</span>
            )}
            <span>{formatTime(timestamp)}</span>
            {isOwn && (
              <StatusIcon className={cn("w-3 h-3", statusColors[status])} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};