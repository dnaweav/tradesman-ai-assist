import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Plus, Upload, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ChatSessionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  currentTitle?: string;
  currentChatType?: string;
  currentContactId?: string;
  currentDescription?: string;
  currentVoiceEnabled?: boolean;
  onSave: (data: ChatSessionData) => void;
}

interface ChatSessionData {
  title: string;
  chat_type: string;
  contact_id: string | null;
  description: string;
  voice_enabled: boolean;
}

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface Tag {
  id: string;
  name: string;
}

const CHAT_TYPES = [
  "Quote",
  "Job",
  "Admin",
  "Advice",
  "Client Follow-Up",
  "Support",
  "Planning",
  "Other"
];

export function ChatSessionDetailsModal({
  open,
  onOpenChange,
  sessionId,
  currentTitle = "",
  currentChatType = "",
  currentContactId = "",
  currentDescription = "",
  currentVoiceEnabled = false,
  onSave
}: ChatSessionDetailsModalProps) {
  console.log('ChatSessionDetailsModal rendered:', { 
    open, 
    sessionId, 
    currentTitle,
    currentChatType,
    currentContactId,
    currentDescription,
    currentVoiceEnabled
  });
  
  // Early validation logging
  if (open && !sessionId) {
    console.warn('Modal opened without sessionId!');
  }
  
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newContactName, setNewContactName] = useState("");
  const [showNewContact, setShowNewContact] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } = useForm<ChatSessionData>({
    defaultValues: {
      title: currentTitle,
      chat_type: currentChatType,
      contact_id: currentContactId || null,
      description: currentDescription,
      voice_enabled: currentVoiceEnabled
    }
  });

  const watchedVoiceEnabled = watch("voice_enabled");

  useEffect(() => {
    if (open && user) {
      console.log('Loading modal data...');
      setDataLoading(true);
      Promise.all([
        loadContacts(),
        loadTags(), 
        loadSessionTags()
      ]).finally(() => {
        setDataLoading(false);
        console.log('Modal data loaded');
      });
    }
  }, [open, user]);

  useEffect(() => {
    if (open) {
      reset({
        title: currentTitle,
        chat_type: currentChatType,
        contact_id: currentContactId || null,
        description: currentDescription,
        voice_enabled: currentVoiceEnabled
      });
    }
  }, [open, currentTitle, currentChatType, currentContactId, currentDescription, currentVoiceEnabled, reset]);

  const loadContacts = async () => {
    if (!user) return;
    
    try {
      console.log('Loading contacts...');
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
      
      if (error) {
        console.error('Error loading contacts:', error);
      } else {
        console.log('Contacts loaded:', data?.length || 0);
        setContacts(data || []);
      }
    } catch (error) {
      console.error('Exception loading contacts:', error);
      setContacts([]);
    }
  };

  const loadTags = async () => {
    if (!user) return;
    
    try {
      console.log('Loading tags...');
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('created_by_user_id', user.id)
        .order('name');
      
      if (error) {
        console.error('Error loading tags:', error);
      } else {
        console.log('Tags loaded:', data?.length || 0);
        setTags(data || []);
      }
    } catch (error) {
      console.error('Exception loading tags:', error);
      setTags([]);
    }
  };

  const loadSessionTags = async () => {
    const { data } = await supabase
      .from('chat_session_tags')
      .select('tag_id')
      .eq('chat_session_id', sessionId);
    
    if (data) {
      setSelectedTags(data.map(item => item.tag_id));
    }
  };

  const createContact = async () => {
    if (!user || !newContactName.trim()) return;
    
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        user_id: user.id,
        name: newContactName.trim()
      })
      .select()
      .single();
    
    if (data && !error) {
      setContacts(prev => [...prev, data]);
      setValue("contact_id", data.id);
      setNewContactName("");
      setShowNewContact(false);
    }
  };

  const handleTagToggle = async (tagId: string) => {
    const isSelected = selectedTags.includes(tagId);
    
    if (isSelected) {
      // Remove tag
      await supabase
        .from('chat_session_tags')
        .delete()
        .eq('chat_session_id', sessionId)
        .eq('tag_id', tagId);
      
      setSelectedTags(prev => prev.filter(id => id !== tagId));
    } else {
      // Add tag
      await supabase
        .from('chat_session_tags')
        .insert({
          chat_session_id: sessionId,
          tag_id: tagId
        });
      
      setSelectedTags(prev => [...prev, tagId]);
    }
  };

  const onSubmit = async (data: ChatSessionData) => {
    setLoading(true);
    
    // Handle file uploads
    if (files.length > 0) {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}/${sessionId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('chat_files')
          .upload(fileName, file);
        
        if (!uploadError) {
          await supabase
            .from('chat_files')
            .insert({
              chat_session_id: sessionId,
              file_name: file.name,
              file_path: fileName,
              file_size: file.size,
              file_type: file.type
            });
        }
      }
    }
    
    onSave(data);
    setLoading(false);
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  if (!sessionId) {
    console.error('No sessionId provided to modal');
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-background">
          <DialogHeader>
            <DialogTitle className="text-foreground">No Active Chat</DialogTitle>
          </DialogHeader>
          <div className="text-center p-6">
            <p className="text-muted-foreground mb-4">
              This feature is only available within an active chat session.
            </p>
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  console.log('Rendering main modal content:', { sessionId, dataLoading, contacts: contacts.length, tags: tags.length });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-red-500 min-h-[400px]">
        <DialogHeader className="bg-blue-100 p-4">
          <DialogTitle className="text-black text-xl">Chat Session Settings (DEBUG MODE)</DialogTitle>
        </DialogHeader>
        
        {/* Forced visible content for debugging */}
        <div className="bg-yellow-100 text-black p-4 border-2 border-yellow-500">
          <h2 className="text-lg font-bold">DEBUG: Modal Content Test</h2>
          <p>SessionID: {sessionId}</p>
          <p>Open: {open.toString()}</p>
          <p>Loading: {dataLoading.toString()}</p>
          <p>Contacts: {contacts.length}</p>
          <p>Tags: {tags.length}</p>
        </div>
        
        {dataLoading ? (
          <div className="bg-green-100 text-black p-8 border-2 border-green-500">
            <div className="text-xl font-bold">LOADING STATE - Should be visible</div>
          </div>
        ) : (
          <div className="bg-purple-100 text-black p-6 border-2 border-purple-500">
            <h3 className="text-xl font-bold mb-4">CONTENT LOADED - This should be visible!</h3>
            <p>If you can see this, the modal is working.</p>
            
            <Button 
              onClick={() => onOpenChange(false)}
              className="mt-4 bg-red-500 text-white"
            >
              Close Modal (Test Button)
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}