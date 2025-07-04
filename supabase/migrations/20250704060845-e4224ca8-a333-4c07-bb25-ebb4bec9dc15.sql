-- Add missing columns to chat_sessions table
ALTER TABLE public.chat_sessions 
ADD COLUMN chat_type TEXT,
ADD COLUMN voice_enabled BOOLEAN DEFAULT false,
ADD COLUMN description TEXT;

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tags table
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by_user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, created_by_user_id)
);

-- Create chat_session_tags junction table
CREATE TABLE public.chat_session_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  UNIQUE(chat_session_id, tag_id)
);

-- Create chat_files table
CREATE TABLE public.chat_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for chat files
INSERT INTO storage.buckets (id, name, public) VALUES ('chat_files', 'chat_files', false);

-- Enable RLS on new tables
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_session_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_files ENABLE ROW LEVEL SECURITY;

-- RLS policies for contacts
CREATE POLICY "Users can view their own contacts" 
ON public.contacts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contacts" 
ON public.contacts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts" 
ON public.contacts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts" 
ON public.contacts FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for tags
CREATE POLICY "Users can view their own tags" 
ON public.tags FOR SELECT 
USING (auth.uid() = created_by_user_id);

CREATE POLICY "Users can create their own tags" 
ON public.tags FOR INSERT 
WITH CHECK (auth.uid() = created_by_user_id);

CREATE POLICY "Users can update their own tags" 
ON public.tags FOR UPDATE 
USING (auth.uid() = created_by_user_id);

CREATE POLICY "Users can delete their own tags" 
ON public.tags FOR DELETE 
USING (auth.uid() = created_by_user_id);

-- RLS policies for chat_session_tags
CREATE POLICY "Users can view their chat session tags" 
ON public.chat_session_tags FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM chat_sessions 
  WHERE chat_sessions.id = chat_session_tags.chat_session_id 
  AND chat_sessions.user_id = auth.uid()
));

CREATE POLICY "Users can create their chat session tags" 
ON public.chat_session_tags FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM chat_sessions 
  WHERE chat_sessions.id = chat_session_tags.chat_session_id 
  AND chat_sessions.user_id = auth.uid()
));

CREATE POLICY "Users can delete their chat session tags" 
ON public.chat_session_tags FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM chat_sessions 
  WHERE chat_sessions.id = chat_session_tags.chat_session_id 
  AND chat_sessions.user_id = auth.uid()
));

-- RLS policies for chat_files
CREATE POLICY "Users can view their chat files" 
ON public.chat_files FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM chat_sessions 
  WHERE chat_sessions.id = chat_files.chat_session_id 
  AND chat_sessions.user_id = auth.uid()
));

CREATE POLICY "Users can create their chat files" 
ON public.chat_files FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM chat_sessions 
  WHERE chat_sessions.id = chat_files.chat_session_id 
  AND chat_sessions.user_id = auth.uid()
));

CREATE POLICY "Users can delete their chat files" 
ON public.chat_files FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM chat_sessions 
  WHERE chat_sessions.id = chat_files.chat_session_id 
  AND chat_sessions.user_id = auth.uid()
));

-- Storage policies for chat_files bucket
CREATE POLICY "Users can view their own chat files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'chat_files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own chat files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'chat_files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own chat files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'chat_files' AND auth.uid()::text = (storage.foldername(name))[1]);