import React, { useState, useRef } from "react";
import { Send, Paperclip, Smile, Mic, X, Play, Pause } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import { useChat } from "../../context/ChatContext";
import { useVoiceRecording } from "../../hooks/useVoiceRecording";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function MessageInput() {
  const { activeChat, sendMessage, sendAudioMessage } = useChat();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice recording hook
  const {
    isRecording,
    recordingTime,
    audioBlob,
    startRecording,
    stopRecording,
    cancelRecording,
    error: recordingError,
  } = useVoiceRecording();

  // Check if current chat is blocked
  const isBlocked =
    activeChat?.isBlocked ||
    activeChat?.participants.find((p) => p.id === activeChat?.id)?.isBlocked;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlocked) {
      toast.error("Cannot send message to blocked contact");
      return;
    }

    if (message.trim()) {
      sendMessage(message.trim());
      setMessage("");
    }
  };

  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeChat) {
      console.log("File selected:", file);
      // Handle file upload logic here
    }
  };

  const handleVoiceRecord = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      try {
        await startRecording();
      } catch (error) {
        console.log("Error starting recording:", error);
        toast.error("Failed to start recording. Please check microphone permissions.");
      }
    }
  };

  const handleSendAudio = async () => {
    if (audioBlob && recordingTime > 0) {
      try {
        await sendAudioMessage(audioBlob, recordingTime);
        cancelRecording();
        toast.success("Voice message sent!");
      } catch (error) {
        toast.error("Failed to send voice message");
        console.error("Error sending voice message:", error);
      }
    }
  };

  const handleCancelAudio = () => {
    cancelRecording();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isBlocked) {
    return (
      <Card className="m-4 bg-light-coral/10 border-light-coral/20">
        <div className="text-center text-light-coral py-4">
          <p className="font-medium">Cannot send messages</p>
          <p className="text-sm opacity-80">This contact has been blocked</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="m-4" padding="sm">
      {/* Voice Recording UI */}
      {(isRecording || audioBlob) && (
        <div className="mb-4 p-4 bg-hunyadi-yellow/10 rounded-xl border border-hunyadi-yellow/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isRecording ? (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <Mic className="h-4 w-4 text-red-500" />
                  <span className="font-mono text-sm text-text-primary">
                    {formatTime(recordingTime)}
                  </span>
                  {/* Animated waveform */}
                  <div className="flex items-center space-x-1 ml-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-hunyadi-yellow rounded-full waveform-bar"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 text-hunyadi-yellow" />
                  <span className="text-sm text-text-primary">
                    Voice message ({formatTime(recordingTime)})
                  </span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={isRecording ? handleCancelAudio : handleCancelAudio}
                icon={<X className="h-4 w-4" />}
                className="text-text-tertiary hover:text-light-coral"
              />
              {isRecording ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleVoiceRecord}
                  icon={<Pause className="h-4 w-4" />}
                />
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSendAudio}
                  icon={<Send className="h-4 w-4" />}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Text Input */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <div className="flex items-center space-x-2 bg-cambridge-blue/5 rounded-2xl px-4 py-3 border border-cambridge-blue/10 focus-within:border-cambridge-blue/30 transition-colors">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              icon={<Smile className="h-5 w-5" />}
              className="p-1 text-text-tertiary hover:text-hunyadi-yellow"
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none outline-none placeholder-text-tertiary text-text-primary resize-none max-h-32 min-h-[24px]"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '24px',
                maxHeight: '128px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              icon={<Paperclip className="h-5 w-5" />}
              className="p-1 text-text-tertiary hover:text-cambridge-blue"
            />

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            />
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2 left-0 z-10">
              <Card className="shadow-xl">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={320}
                  height={400}
                />
              </Card>
            </div>
          )}
        </div>

        {/* Send/Voice Button */}
        {message.trim() ? (
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Send className="h-5 w-5" />}
            className="rounded-full p-3"
          />
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleVoiceRecord}
            icon={<Mic className="h-5 w-5" />}
            className="rounded-full p-3"
            disabled={isRecording || !!audioBlob}
          />
        )}
      </form>

      {/* Recording Error */}
      {recordingError && (
        <div className="mt-2 p-2 bg-light-coral/10 border border-light-coral/20 rounded-lg">
          <p className="text-sm text-light-coral">{recordingError}</p>
        </div>
      )}
    </Card>
  );
}