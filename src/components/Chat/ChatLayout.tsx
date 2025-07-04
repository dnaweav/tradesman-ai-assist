import { ChatHeader } from "./ChatHeader";
import { MessageThread } from "./MessageThread";
import { InputBar } from "@/components/InputBar";
import { ChatFAB } from "./ChatFAB";
import { ChatSessionDetailsModal } from "./ChatSessionDetailsModal";
import { ChatMicrophoneButton } from "./ChatMicrophoneButton";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { ChatSession } from "@/hooks/useChatSession";

interface ChatLayoutProps {
  session: ChatSession | null;
  messages: any[];
  isStreaming: boolean;
  isAutoReadEnabled: boolean;
  onAutoReadToggle: (enabled: boolean) => void;
  onBack: () => void;
  input: string;
  onInputChange: (value: string) => void;
  onSend: (message: string, files: File[]) => void;
  onMicClick: () => void;
  footerHeight: number;
  onFooterHeightChange: (height: number) => void;
  modalOpen: boolean;
  onModalOpenChange: (open: boolean) => void;
  sessionId: string;
  onSaveSessionDetails: (data: any) => void;
}

export function ChatLayout({
  session,
  messages,
  isStreaming,
  isAutoReadEnabled,
  onAutoReadToggle,
  onBack,
  input,
  onInputChange,
  onSend,
  onMicClick,
  footerHeight,
  onFooterHeightChange,
  modalOpen,
  onModalOpenChange,
  sessionId,
  onSaveSessionDetails
}: ChatLayoutProps) {
  const isKeyboardVisible = useKeyboardVisible();
  
  console.log('Rendering main chat UI');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <ChatHeader
        title={session?.title || 'New Chat'}
        onBack={onBack}
        isAutoReadEnabled={isAutoReadEnabled}
        onAutoReadToggle={onAutoReadToggle}
      />

      {/* Message Thread - Wrapped in ErrorBoundary */}
      <div className="flex-1 overflow-hidden pt-16 pb-32">
        <ErrorBoundary
          fallback={
            <div className="h-full flex items-center justify-center">
              <div className="text-center px-4">
                <div className="text-red-500 text-lg font-semibold mb-2">
                  Chat Display Error
                </div>
                <div className="text-gray-600 mb-4">
                  There was a problem displaying the chat messages.
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          }
        >
          <MessageThread
            messages={messages}
            isStreaming={isStreaming}
            isAutoReadEnabled={isAutoReadEnabled}
          />
        </ErrorBoundary>
      </div>

      {/* Microphone Button */}
      <ChatMicrophoneButton 
        onMicClick={onMicClick}
        isKeyboardVisible={isKeyboardVisible}
      />

      {/* Chat FAB */}
      <ChatFAB onClick={() => onModalOpenChange(true)} bottomOffset={footerHeight + 20} />

      {/* Chat Session Details Modal */}
      <ChatSessionDetailsModal
        open={modalOpen}
        onOpenChange={onModalOpenChange}
        sessionId={sessionId}
        currentTitle={session?.title}
        currentChatType={session?.chat_type}
        currentContactId={session?.contact_id}
        currentDescription={session?.description}
        currentVoiceEnabled={session?.voice_enabled || false}
        onSave={onSaveSessionDetails}
      />

      {/* Fixed Input Bar */}
      <div className="fixed bottom-0 w-full z-50 backdrop-blur-md">
        <InputBar
          value={input}
          onChange={onInputChange}
          onSend={onSend}
          onMicClick={onMicClick}
          onHeightChange={onFooterHeightChange}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}