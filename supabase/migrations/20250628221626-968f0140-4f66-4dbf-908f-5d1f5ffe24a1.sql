
-- Create chat_sessions table
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Chat',
  contact_id UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own chat sessions
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Chat sessions policies
CREATE POLICY "Users can view their own chat sessions" 
  ON public.chat_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat sessions" 
  ON public.chat_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" 
  ON public.chat_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions" 
  ON public.chat_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Messages policies  
CREATE POLICY "Users can view messages from their chat sessions" 
  ON public.messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions 
      WHERE id = messages.chat_session_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their chat sessions" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_sessions 
      WHERE id = messages.chat_session_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages in their chat sessions" 
  ON public.messages 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions 
      WHERE id = messages.chat_session_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages from their chat sessions" 
  ON public.messages 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions 
      WHERE id = messages.chat_session_id 
      AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_messages_chat_session_id ON public.messages(chat_session_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
