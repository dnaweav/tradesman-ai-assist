
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  chat_type?: string;
  contact_id?: string;
  description?: string;
  voice_enabled?: boolean;
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
  console.log('useChatSession hook initialized with sessionId:', sessionId);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert database message to Message type
  const convertDatabaseMessage = (dbMessage: DatabaseMessage): Message => ({
    id: dbMessage.id,
    sender: dbMessage.sender as 'user' | 'ai',
    content: dbMessage.content,
    created_at: dbMessage.created_at
  });

  // Load chat session and messages with improved error handling
  const loadChatSession = useCallback(async (retryCount = 0) => {
    console.log('loadChatSession called:', { user: !!user, sessionId, retryCount });
    
    if (!user || !sessionId) {
      console.log('Missing user or sessionId, returning early');
      return;
    }

    try {
      setError(null);
      console.log('Attempting to load existing session');
      
      // Try to load existing session first
      let { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();

      console.log('Session query result:', { sessionData, sessionError });

      if (sessionError && sessionError.code !== 'PGRST116') {
        console.error('Error loading chat session:', sessionError);
        throw sessionError;
      }

      // If session doesn't exist, create it with retry logic
      if (!sessionData) {
        console.log('Session not found, creating new session');
        try {
          const { data: newSession, error: createError } = await supabase
            .from('chat_sessions')
            .insert({
              id: sessionId,
              user_id: user.id,
              title: 'New Chat'
            })
            .select()
            .single();

          console.log('Session creation result:', { newSession, createError });

          if (createError) {
            // Handle duplicate key constraint violation
            if (createError.code === '23505' && retryCount < 3) {
              console.log('Duplicate session detected, attempting to fetch existing session...');
              
              // Wait a bit and try to fetch the existing session
              await new Promise(resolve => setTimeout(resolve, 100));
              
              const { data: existingSession, error: fetchError } = await supabase
                .from('chat_sessions')
                .select('*')
                .eq('id', sessionId)
                .maybeSingle();

              console.log('Retry fetch result:', { existingSession, fetchError });

              if (fetchError) {
                throw fetchError;
              }

              if (existingSession) {
                sessionData = existingSession;
              } else {
                // Retry with exponential backoff
                const delay = Math.pow(2, retryCount) * 100;
                console.log('Retrying with delay:', delay);
                await new Promise(resolve => setTimeout(resolve, delay));
                return loadChatSession(retryCount + 1);
              }
            } else {
              throw createError;
            }
          } else {
            sessionData = newSession;
          }
        } catch (createError) {
          console.error('Error creating chat session:', createError);
          throw createError;
        }
      }

      console.log('Setting session data:', sessionData);
      setSession(sessionData);

      // Load messages
      console.log('Loading messages for session:', sessionId);
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_session_id', sessionId)
        .order('created_at', { ascending: true });

      console.log('Messages query result:', { messagesData, messagesError });

      if (messagesError) {
        console.error('Error loading messages:', messagesError);
        // Don't throw here, just show empty messages
        setMessages([]);
      } else {
        const convertedMessages = (messagesData || []).map(convertDatabaseMessage);
        console.log('Setting messages:', convertedMessages.length);
        setMessages(convertedMessages);
      }
    } catch (error) {
      console.error('Error in loadChatSession:', error);
      setError('Failed to load chat session. Please try again.');
      
      // Create a fallback session to prevent blank page
      console.log('Creating fallback session');
      setSession({
        id: sessionId,
        title: 'New Chat',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setMessages([]);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  }, [user, sessionId]);

  // Send message and get AI response
  const sendMessage = useCallback(async (content: string, files: File[] = []) => {
    console.log('sendMessage called:', { content, filesCount: files.length });
    
    if (!user || !sessionId || !content.trim()) {
      console.log('Invalid send message parameters');
      return;
    }

    try {
      console.log('Saving user message');
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
      console.log('Adding user message to state:', convertedUserMessage);
      setMessages(prev => [...prev, convertedUserMessage]);

      // Start streaming AI response
      setIsStreaming(true);
      console.log('Starting AI response simulation');
      
      // TODO: Implement actual AI streaming response
      // For now, simulate a response
      setTimeout(async () => {
        const aiResponse = `I understand you said: "${content}". This is a placeholder AI response. In the full implementation, this would be a real AI response from GPT.`;
        
        console.log('Saving AI response');
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
          console.log('Adding AI message to state:', convertedAiMessage);
          setMessages(prev => [...prev, convertedAiMessage]);
        }
        
        setIsStreaming(false);
        console.log('AI response complete');
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
    console.log('useEffect triggered for loadChatSession');
    loadChatSession();
  }, [loadChatSession]);

  return {
    session,
    messages,
    loading,
    isStreaming,
    error,
    sendMessage
  };
}
