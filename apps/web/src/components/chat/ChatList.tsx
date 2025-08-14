import { format, isValid } from "date-fns";
import { Pin, VolumeX, MessageCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { Chat } from "../../types";
import { useChat } from "../../context/ChatContext";
import { isUserOnline } from "../../utils/userUtils";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

export function ChatList() {
  const { chats, activeChat, setActiveChat, searchQuery } = useChat();
  const { user } = useAuth();

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      chat.groupName?.toLowerCase().includes(searchLower) ||
      chat.participants?.some((p) =>
        p.displayName?.toLowerCase().includes(searchLower)
      ) ||
      chat.lastMessage?.content.toLowerCase().includes(searchLower)
    );
  });

  const sortedChats = filteredChats.sort((a, b) => {
    // Pin status
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // Last message timestamp
    const aTime = a.lastMessage?.timestamp || new Date(0);
    const bTime = b.lastMessage?.timestamp || new Date(0);
    return bTime.getTime() - aTime.getTime();
  });

  const getChatName = (chat: Chat) => {
    if (chat.isGroup) {
      return chat.groupName || "Group Chat";
    }
    return (
      chat.participants?.find((p) => p.id !== user?.id)?.displayName ||
      "Unknown"
    );
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.isGroup) {
      return null;
    }
    return chat.participants?.find((p) => p.id !== user?.id)?.avatarUrl || null;
  };

  const getLastMessagePreview = (chat: Chat) => {
    if (!chat.lastMessage) return "No messages yet";

    const { content, type, senderId } = chat.lastMessage;
    const sender =
      senderId === user?.id
        ? "You"
        : chat.participants?.find((p) => p.id === senderId)?.displayName;

    const prefix = chat.isGroup
      ? `${sender}: `
      : senderId === user?.id
        ? "You: "
        : "";

    switch (type) {
      case "image":
        return `${prefix}📷 Photo`;
      case "file":
        return `${prefix}📄 File`;
      case "audio":
        return `${prefix}🎵 Voice message`;
      default:
        return `${prefix}${content}`;
    }
  };

  const formatMessageTime = (timestamp: Date) => {
    if (!timestamp || !isValid(timestamp)) {
      return "";
    }
    return format(timestamp, "HH:mm");
  };

  const getOtherUser = (chat: Chat) => {
    return chat.participants?.find((p) => p.id !== user?.id);
  };

  if (sortedChats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-tertiary p-8">
        <MessageCircle className="h-16 w-16 mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">No chats yet</p>
        <p className="text-sm text-center">
          {searchQuery ? "No chats match your search" : "Start a conversation by adding a contact"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {sortedChats.map((chat) => {
            const otherUser = getOtherUser(chat);
            const isActive = activeChat?.id === chat.id;
            
            return (
              <Card
                key={chat.id}
                padding="none"
                hover
                className={`cursor-pointer transition-all duration-200 ${
                  isActive 
                    ? "bg-hunyadi-yellow/10 border-hunyadi-yellow/30 shadow-md" 
                    : "hover:bg-cambridge-blue/5"
                }`}
                onClick={() => setActiveChat(chat)}
              >
                <div className="flex items-center space-x-3 p-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {chat.isGroup ? (
                      <Avatar
                        fallback="G"
                        size="lg"
                        className="bg-cambridge-blue/20"
                      />
                    ) : (
                      <Avatar
                        src={getChatAvatar(chat) ?? undefined}
                        fallback={getChatName(chat).charAt(0)}
                        size="lg"
                        status={otherUser && isUserOnline(otherUser) ? "online" : "offline"}
                        showStatus={!chat.isGroup}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <h3 className="font-medium text-text-primary truncate">
                          {getChatName(chat)}
                        </h3>
                        {chat.isPinned && (
                          <Pin className="h-3 w-3 text-cambridge-blue flex-shrink-0" />
                        )}
                        {chat.isMuted && (
                          <VolumeX className="h-3 w-3 text-text-tertiary flex-shrink-0" />
                        )}
                      </div>
                      {chat.lastMessage && (
                        <span className="text-xs text-text-tertiary flex-shrink-0 ml-2">
                          {formatMessageTime(chat.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-text-secondary truncate flex-1 mr-2">
                        {getLastMessagePreview(chat)}
                      </p>
                      {chat.unreadCount > 0 && (
                        <Badge 
                          variant="success" 
                          className="bg-hunyadi-yellow text-ink-900 border-hunyadi-yellow/30 flex-shrink-0"
                        >
                          {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}