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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Chat Session Settings</DialogTitle>
        </DialogHeader>
        
        {/* Debug info - remove later */}
        <div className="text-xs text-muted-foreground p-2 bg-muted/20 rounded">
          Debug: sessionId={sessionId}, loading={dataLoading.toString()}, contacts={contacts.length}, tags={tags.length}
        </div>
        
        {dataLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Simplified test content */}
            <div className="border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Basic Chat Info</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Session ID:</strong> {sessionId}</p>
                <p><strong>Current Title:</strong> {currentTitle || 'No title'}</p>
                <p><strong>Chat Type:</strong> {currentChatType || 'No type'}</p>
                <p><strong>Voice Enabled:</strong> {currentVoiceEnabled ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {/* Basic form - simplified */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="title">Chat Title</Label>
                <Input
                  id="title"
                  placeholder="Enter chat title"
                  {...register("title")}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="chat_type">Chat Type</Label>
                <Select onValueChange={(value) => setValue("chat_type", value)} value={watch("chat_type")}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHAT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="voice_enabled"
                  checked={watchedVoiceEnabled}
                  onCheckedChange={(checked) => setValue("voice_enabled", checked)}
                />
                <Label htmlFor="voice_enabled">Enable voice responses</Label>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}