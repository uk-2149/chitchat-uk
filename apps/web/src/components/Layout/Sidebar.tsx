import { useState } from "react";
import { Settings, LogOut, MessageCircle, Phone, Users, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { Avatar } from "../ui/Avatar";
import { SearchInput } from "../ui/SearchInput";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/Tabs";
import { Button } from "../ui/Button";
import { ChatList } from "../chat/ChatList";
import { CallHistory } from "../call/CallHistory";
import { Settings as SettingsModal } from "../settings/Settings";

export function Sidebar() {
  const [activeTab, setActiveTab] = useState("chats");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useChat();

  return (
    <div className="w-full lg:w-80 bg-bg-surface border-r border-border-secondary flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border-secondary">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Avatar
              src={user?.avatarUrl}
              fallback={user?.displayName?.charAt(0)}
              size="lg"
              status="online"
              showStatus
            />
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-text-primary truncate">
                {user?.displayName}
              </h2>
              <p className="text-sm text-text-secondary truncate">
                {user?.status || "Available"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
              icon={<Settings className="h-4 w-4" />}
              className="p-2"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              icon={<LogOut className="h-4 w-4" />}
              className="p-2 text-light-coral hover:text-light-coral hover:bg-light-coral/10"
            />
          </div>
        </div>

        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={`Search ${activeTab}...`}
        />
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-border-secondary">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="chats" className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chats
            </TabsTrigger>
            <TabsTrigger value="calls" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Calls
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="chats" className="h-full mt-0">
            <ChatList />
          </TabsContent>
          <TabsContent value="calls" className="h-full mt-0">
            <CallHistory />
          </TabsContent>
        </Tabs>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}