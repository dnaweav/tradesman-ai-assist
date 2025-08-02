
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ChatLayout } from "@/components/Chat/ChatLayout";
import { ChatLoadingState } from "@/components/Chat/ChatLoadingState";
import { ChatErrorState } from "@/components/Chat/ChatErrorState";
import { useChatSessionLogic } from "@/hooks/useChatSessionLogic";

export default function ChatSession() {
  console.log('ChatSession component rendering');
  
  const navigate = useNavigate();
  const {
    // State
    sessionId,
    user,
    input,
    setInput,
    isAutoReadEnabled,
    setIsAutoReadEnabled,
    modalOpen,
    setModalOpen,
    footerHeight,
    setFooterHeight,
    
    // Chat session data
    session,
    messages,
    loading,
    isStreaming,
    error,
    
    // Handlers
    handleSend,
    handleMic,
    handleBack,
    handleSaveSessionDetails
  } = useChatSessionLogic();

  if (!user) {
    console.log('No user, redirecting to auth');
    navigate('/auth');
    return null;
  }

  if (loading) {
    return <ChatLoadingState />;
  }

  if (error) {
    return (
      <ChatErrorState
        error={error}
        onBack={handleBack}
        isAutoReadEnabled={isAutoReadEnabled}
        onAutoReadToggle={setIsAutoReadEnabled}
      />
    );
  }

  return (
    <ChatLayout
      session={session}
      messages={messages}
      isStreaming={isStreaming}
      isAutoReadEnabled={isAutoReadEnabled}
      onAutoReadToggle={setIsAutoReadEnabled}
      onBack={handleBack}
      input={input}
      onInputChange={setInput}
      onSend={handleSend}
      onMicClick={handleMic}
      footerHeight={footerHeight}
      onFooterHeightChange={setFooterHeight}
      modalOpen={modalOpen}
      onModalOpenChange={(open) => {
        console.log('Modal open change called:', open);
        setModalOpen(open);
      }}
      sessionId={sessionId || ''}
      onSaveSessionDetails={handleSaveSessionDetails}
    />
  );
}
