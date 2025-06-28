
import * as React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChatHeader } from "@/components/Chat/ChatHeader";
import { MessageThread } from "@/components/Chat/MessageThread";
import { InputBar } from "@/components/InputBar";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { useChatSession } from "@/hooks/useChatSession";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";

export default function ChatSession() {
  console.log('ChatSession component rendering');
  
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isKeyboardVisible = useKeyboardVisible();
  
  const [input, setInput] = React.useState("");
  const [micActive, setMicActive] = React.useState(false);
  const [isAutoReadEnabled, setIsAutoReadEnabled] = React.useState(false);
  const [initialMessageSent, setInitialMessageSent] = React.useState(false);
  
  console.log('ChatSession state:', { sessionId, user: !!user, initialMessageSent });

  const {
    session,
    messages,
    loading,
    sendMessage,
    isStreaming,
    error
  } = useChatSession(sessionId || '');

  console.log('ChatSession hook state:', { 
    sessionExists: !!session, 
    messagesCount: messages.length, 
    loading, 
    error 
  });

  // Handle initial message from navigation state
  React.useEffect(() => {
    const state = location.state as { initialMessage?: string; initialFiles?: File[] } | null;
    
    console.log('Initial message effect:', { 
      hasInitialMessage: !!state?.initialMessage, 
      initialMessageSent, 
      loading, 
      sessionExists: !!session 
    });
    
    if (state?.initialMessage && !initialMessageSent && !loading && session) {
      console.log('Sending initial message:', state.initialMessage);
      sendMessage(state.initialMessage, state.initialFiles || []);
      setInitialMessageSent(true);
      
      // Clear the navigation state to prevent re-sending on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, initialMessageSent, loading, session, sendMessage, navigate, location.pathname]);

  const handleSend = async (message: string, files: File[]) => {
    if (!message.trim() && files.length === 0) return;
    
    console.log('Sending message:', message);
    await sendMessage(message, files);
    setInput('');
  };

  const handleMic = () => {
    setMicActive(true);
    setTimeout(() => setMicActive(false), 480);
    // TODO: Integrate Whisper API for voice transcription
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!user) {
    console.log('No user, redirecting to auth');
    navigate('/auth');
    return null;
  }

  if (loading) {
    console.log('Loading state - showing loading UI');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    );
  }

  // Show error state instead of blank page
  if (error) {
    console.log('Error state:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ChatHeader
          title="Chat Error"
          onBack={handleBack}
          isAutoReadEnabled={isAutoReadEnabled}
          onAutoReadToggle={setIsAutoReadEnabled}
        />
        
        <div className="flex-1 flex items-center justify-center pt-16 pb-32">
          <div className="text-center px-4">
            <div className="text-red-500 text-lg font-semibold mb-2">
              Unable to load chat
            </div>
            <div className="text-gray-600 mb-4">
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering main chat UI');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <ChatHeader
        title={session?.title || 'New Chat'}
        onBack={handleBack}
        isAutoReadEnabled={isAutoReadEnabled}
        onAutoReadToggle={setIsAutoReadEnabled}
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

      {/* Microphone Button - Hidden when keyboard is visible */}
      <div className={cn(
        "fixed left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300 ease-in-out",
        isKeyboardVisible 
          ? "opacity-0 pointer-events-none scale-95 translate-y-4" 
          : "opacity-100 scale-100 translate-y-0"
      )} style={{ bottom: "140px" }}>
        <button
          className="w-12 h-12 rounded-full border-3 border-white bg-[#ffc000] shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-150"
          style={{ boxShadow: "0 8px 32px #ffc00040" }}
          aria-label="Voice input"
          onClick={handleMic}
          type="button"
        >
          <Mic className="w-5 h-5 text-black" strokeWidth={2} />
        </button>
      </div>

      {/* Fixed Input Bar */}
      <div className="fixed bottom-0 w-full z-50 backdrop-blur-md">
        <InputBar
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onMicClick={handleMic}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}
