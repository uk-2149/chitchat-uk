import { useEffect, useRef, useState } from "react";
import { Phone, Video, Info, ArrowLeft, MoreVertical } from "lucide-react";
import { MessageBubble } from "../ui/MessageBubble";
import { MessageInput } from "./MessageInput";
import { DateSeparator } from "./DateSeparator";
import { ContactInfo } from "./ContactInfo";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { groupMessagesByDate } from "../../utils/messageUtils";
import { isUserOnline, getUserOnlineStatusText } from "../../utils/userUtils";
import { ChatOptions } from "./ChatOptions";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { TypingIndicator } from "../ui/TypingIndicator";

export function ChatWindow() {
  const { activeChat, setActiveChat, initiateCall, deleteContact } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const showBackButton = useMediaQuery("(max-width: 1030px)");
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  // Simulate typing indicator (you can replace this with real typing detection)
  useEffect(() => {
    if (activeChat?.messages.length) {
      setShowTyping(true);
      const timer = setTimeout(() => setShowTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [activeChat?.messages]);

  const handleBackClick = () => {
    setActiveChat(null);
  };

  const handleInitiateCall = (callType: "audio" | "video") => {
    if (!activeChat || !user) return;
    const callee = activeChat.participants.find((p) => p.id !== user.id);
    if (callee) {
      initiateCall(callee, callType);
    }
  };

  const handleContactInfoCall = (callType: "audio" | "video") => {
    handleInitiateCall(callType);
    setIsContactInfoOpen(false);
  };

  const handleBlockContact = () => {
    console.log("Block contact");
    setIsContactInfoOpen(false);
  };

  const handleDeleteContact = async () => {
    const contact = getContactFromActiveChat();
    if (!contact) return;

    try {
      await deleteContact(contact.id);
      setIsContactInfoOpen(false);
      console.log("Contact deleted successfully");
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  const getContactFromActiveChat = () => {
    if (!activeChat || !user) return null;
    return activeChat.participants.find((p) => p.id !== user.id) || null;
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-primary">
        <Card className="text-center max-w-md mx-auto" padding="lg">
          <div className="w-24 h-24 bg-hunyadi-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-hunyadi-yellow"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Welcome to ChitChat
          </h3>
          <p className="text-text-secondary">
            Select a chat to start messaging or add a new contact to begin
          </p>
        </Card>
      </div>
    );
  }

  const getChatName = () => {
    if (activeChat.isGroup) {
      return activeChat.groupName || "Group Chat";
    }
    return (
      activeChat.participants.find((p) => p.id !== user?.id)?.displayName ||
      "Unknown"
    );
  };

  const getChatAvatar = () => {
    if (activeChat.isGroup) {
      return null;
    }
    return activeChat.participants.find((p) => p.id !== user?.id)?.avatarUrl;
  };

  const getOnlineStatus = () => {
    if (activeChat.isGroup) {
      const onlineCount = activeChat.participants.filter((p) =>
        isUserOnline(p)
      ).length;
      return `${onlineCount} online`;
    }
    const otherUser = activeChat.participants.find((p) => p.id !== user?.id);
    return otherUser
      ? getUserOnlineStatusText(otherUser)
      : "Last seen recently";
  };

  const otherUser = activeChat.participants.find((p) => p.id !== user?.id);

  return (
    <div className="flex-1 flex flex-col bg-bg-primary relative">
      {/* Header */}
      <Card className="flex items-center justify-between p-4 border-b border-border-secondary rounded-none bg-bg-surface">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              icon={<ArrowLeft className="h-5 w-5" />}
              className="p-2"
            />
          )}
          
          <Avatar
            src={getChatAvatar() ?? undefined}
            fallback={getChatName().charAt(0)}
            size="md"
            status={otherUser && isUserOnline(otherUser) ? "online" : "offline"}
            showStatus={!activeChat.isGroup}
          />
          
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-text-primary truncate">
              {getChatName()}
            </h3>
            <p className="text-sm text-text-secondary truncate">
              {getOnlineStatus()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleInitiateCall("audio")}
            disabled={activeChat.isGroup}
            icon={<Phone className="h-5 w-5" />}
            className="p-2"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleInitiateCall("video")}
            disabled={activeChat.isGroup}
            icon={<Video className="h-5 w-5" />}
            className="p-2"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsContactInfoOpen(true)}
            disabled={activeChat.isGroup}
            icon={<Info className="h-5 w-5" />}
            className="p-2"
          />
          <ChatOptions chat={activeChat} />
        </div>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeChat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Card className="text-center" padding="lg">
              <p className="text-text-secondary">
                No messages yet. Start the conversation!
              </p>
            </Card>
          </div>
        ) : (
          (() => {
            const messageGroups = groupMessagesByDate(activeChat.messages);

            return messageGroups.map((group, groupIndex) => (
              <div key={group.date.toISOString()} className="space-y-4">
                <DateSeparator date={group.date} />

                <div className="space-y-3">
                  {group.messages.map((message, messageIndex) => {
                    const previousMessage =
                      messageIndex > 0
                        ? group.messages[messageIndex - 1]
                        : groupIndex > 0
                          ? messageGroups[groupIndex - 1].messages[
                              messageGroups[groupIndex - 1].messages.length - 1
                            ]
                          : null;

                    return (
                      <MessageBubble
                        key={message.id}
                        content={message.content}
                        timestamp={message.timestamp}
                        isOwn={message.senderId === user?.id}
                        status={message.status}
                        showAvatar={
                          !previousMessage ||
                          previousMessage.senderId !== message.senderId
                        }
                        senderName={
                          activeChat.isGroup
                            ? activeChat.participants.find(
                                (p) => p.id === message.senderId
                              )?.displayName
                            : undefined
                        }
                        senderAvatar={
                          activeChat.participants.find(
                            (p) => p.id === message.senderId
                          )?.avatarUrl
                        }
                        type={message.type}
                        mediaUrl={message.mediaUrl}
                        isAI={message.type === "ai_response"}
                      />
                    );
                  })}
                </div>
              </div>
            ));
          })()
        )}

        {/* Typing Indicator */}
        {showTyping && !activeChat.isGroup && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput />

      {/* Contact Info Modal */}
      {!activeChat.isGroup && getContactFromActiveChat() && (
        <ContactInfo
          isOpen={isContactInfoOpen}
          onClose={() => setIsContactInfoOpen(false)}
          contact={getContactFromActiveChat()!}
          onCall={handleContactInfoCall}
          onBlock={handleBlockContact}
          onDeleteContact={handleDeleteContact}
        />
      )}
    </div>
  );
}