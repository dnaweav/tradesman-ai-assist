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
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden bg-card border shadow-xl animate-fade-in">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            Chat Session Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto px-6 pb-6">
          {dataLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                <p className="text-muted-foreground">Loading session details...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 pt-6">
              {/* Session Overview Card */}
              <div className="bg-muted/30 rounded-lg p-5 space-y-3">
                <h3 className="font-medium text-foreground mb-3">Session Overview</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Session ID</p>
                    <p className="font-mono text-xs bg-background px-2 py-1 rounded border">{sessionId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Created</p>
                    <p className="text-foreground">Just now</p>
                  </div>
                </div>
              </div>

              {/* Main Settings Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
                  
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Chat Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="Enter a descriptive title for this chat"
                        {...register("title")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Add a brief description of this chat session"
                        {...register("description")}
                        className="min-h-[80px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Chat Type Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Chat Configuration</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chat_type" className="text-sm font-medium">
                        Chat Type
                      </Label>
                      <Select onValueChange={(value) => setValue("chat_type", value)} value={watch("chat_type")}>
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select chat type" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg">
                          {CHAT_TYPES.map((type) => (
                            <SelectItem key={type} value={type} className="focus:bg-accent">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_id" className="text-sm font-medium">
                        Associated Contact
                      </Label>
                      <Select onValueChange={(value) => setValue("contact_id", value === "none" ? null : value)} value={watch("contact_id") || "none"}>
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select contact" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg">
                          <SelectItem value="none">No contact</SelectItem>
                          {contacts.map((contact) => (
                            <SelectItem key={contact.id} value={contact.id} className="focus:bg-accent">
                              {contact.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Voice Settings Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Voice Settings</h3>
                  
                  <div className="bg-muted/20 rounded-lg p-4 border border-border">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="voice_enabled" className="text-sm font-medium">
                          Voice Responses
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Enable AI voice responses for this chat session
                        </p>
                      </div>
                      <Switch
                        id="voice_enabled"
                        checked={watchedVoiceEnabled}
                        onCheckedChange={(checked) => setValue("voice_enabled", checked)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Tags Section */}
                {tags.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">Tags</h3>
                    
                    <div className="bg-muted/20 rounded-lg p-4 border border-border">
                      <p className="text-sm text-muted-foreground mb-3">
                        Add tags to categorize this chat session
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 5).map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                          >
                            {tag.name}
                          </button>
                        ))}
                        {tags.length > 5 && (
                          <span className="px-3 py-1 text-xs text-muted-foreground">
                            +{tags.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-border">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 bg-primary hover:bg-primary/90"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}