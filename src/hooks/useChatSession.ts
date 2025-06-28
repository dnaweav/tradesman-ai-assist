
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  created_at: string;
}

// Database message type (matches what comes from Supabase)
interface DatabaseMessage {
  id: string;
  chat_session_id: string;
  sender: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export function useChatSession(sessionId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);

  // Helper function to convert database message to Message type
  const convertDatabaseMessage = (dbMessage: DatabaseMessage): Message => ({
    id: dbMessage.id,
    sender: dbMessage.sender as 'user' | 'ai', // Type assertion since we control the values
    content: dbMessage.content,
    created_at: dbMessage.created_at
  });

  // Load chat session and messages
  const loadChatSession = useCallback(async () => {
    if (!user || !sessionId) return;

    try {
      // Load or create chat session
      let { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();

      if (sessionError && sessionError.code !== 'PGRST116') {
        console.error('Error loading chat session:', sessionError);
        return;
      }

      // If session doesn't exist, create it
      if (!sessionData) {
        const { data: newSession, error: createError } = await supabase
          .from('chat_sessions')
          .insert({
            id: sessionId,
            user_id: user.id,
            title: 'New Chat'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating chat session:', createError);
          toast({
            title: "Error",
            description: "Failed to create chat session.",
            variant: "destructive",
          });
          return;
        }

        sessionData = newSession;
      }

      setSession(sessionData);

      // Load messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_session_id', sessionId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error loading messages:', messagesError);
        toast({
          title: "Error",
          description: "Failed to load messages.",
          variant: "destructive",
        });
      } else {
        // Convert database messages to Message type
        const convertedMessages = (messagesData || []).map(convertDatabaseMessage);
        setMessages(convertedMessages);
      }
    } catch (error) {
      console.error('Error in loadChatSession:', error);
    } finally {
      setLoading(false);
    }
  }, [user, sessionId, toast]);

  // Send message and get AI response
  const sendMessage = useCallback(async (content: string, files: File[] = []) => {
    if (!user || !sessionId || !content.trim()) return;

    try {
      // Save user message
      const { data: userMessage, error: userError } = await supabase
        .from('messages')
        .insert({
          chat_session_id: sessionId,
          sender: 'user',
          content: content.trim()
        })
        .select()
        .single();

      if (userError) {
        console.error('Error saving user message:', userError);
        toast({
          title: "Error",
          description: "Failed to send message.",
          variant: "destructive",
        });
        return;
      }

      // Add user message to local state
      const convertedUserMessage = convertDatabaseMessage(userMessage as DatabaseMessage);
      setMessages(prev => [...prev, convertedUserMessage]);

      // Start streaming AI response
      setIsStreaming(true);
      
      // TODO: Implement actual AI streaming response
      // For now, simulate a response
      setTimeout(async () => {
        const aiResponse = `I understand you said: "${content}". This is a placeholder AI response. In the full implementation, this would be a real AI response from GPT.`;
        
        const { data: aiMessage, error: aiError } = await supabase
          .from('messages')
          .insert({
            chat_session_id: sessionId,
            sender: 'ai',
            content: aiResponse
          })
          .select()
          .single();

        if (aiError) {
          console.error('Error saving AI message:', aiError);
        } else {
          const convertedAiMessage = convertDatabaseMessage(aiMessage as DatabaseMessage);
          setMessages(prev => [...prev, convertedAiMessage]);
        }
        
        setIsStreaming(false);
      }, 1500);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsStreaming(false);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  }, [user, sessionId, toast]);

  useEffect(() => {
    loadChatSession();
  }, [loadChatSession]);

  return {
    session,
    messages,
    loading,
    isStreaming,
    sendMessage
  };
}
