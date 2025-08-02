import * as React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useChatSession } from "@/hooks/useChatSession";
import { supabase } from "@/integrations/supabase/client";

export function useChatSessionLogic() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Validate sessionId format (should be a valid UUID)
  const isValidSessionId = sessionId && sessionId !== ':sessionId' && sessionId.length > 10;
  
  console.log('useChatSessionLogic - sessionId validation:', { 
    sessionId, 
    isValidSessionId,
    pathname: location.pathname 
  });
  
  const [input, setInput] = React.useState("");
  const [micActive, setMicActive] = React.useState(false);
  const [isAutoReadEnabled, setIsAutoReadEnabled] = React.useState(false);
  const [initialMessageSent, setInitialMessageSent] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [footerHeight, setFooterHeight] = React.useState(120);
  
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

  const handleSaveSessionDetails = async (data: any) => {
    if (!session) return;
    
    const { error } = await supabase
      .from('chat_sessions')
      .update({
        title: data.title || 'New Chat',
        chat_type: data.chat_type,
        contact_id: data.contact_id,
        description: data.description,
        voice_enabled: data.voice_enabled
      })
      .eq('id', session.id);
    
    if (!error) {
      // Update local auto-read state
      setIsAutoReadEnabled(data.voice_enabled);
      // You might want to refetch session data here
    }
  };

  return {
    // State
    sessionId,
    user,
    input,
    setInput,
    micActive,
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
  };
}