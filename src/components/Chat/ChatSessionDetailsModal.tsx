import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Settings, FileText, Settings2, Mic, Tag, Info, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  { value: "general", label: "General Chat" },
  { value: "work", label: "Work Discussion" },
  { value: "personal", label: "Personal Chat" },
  { value: "support", label: "Support Request" },
  { value: "quote", label: "Quote Request" },
  { value: "job", label: "Job Planning" },
  { value: "admin", label: "Administrative" },
  { value: "advice", label: "Advice & Consultation" },
  { value: "follow-up", label: "Client Follow-Up" },
  { value: "other", label: "Other" }
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
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loadingSessionDetails, setLoadingSessionDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } = useForm<ChatSessionData>({
    defaultValues: {
      title: currentTitle || "New Chat",
      chat_type: currentChatType,
      contact_id: currentContactId || null,
      description: currentDescription,
      voice_enabled: currentVoiceEnabled
    }
  });

  const isOpen = open && !!sessionId;

  useEffect(() => {
    if (isOpen && user) {
      setLoadingSessionDetails(true);
      Promise.all([
        loadContacts(),
        loadTags(), 
        loadSessionTags()
      ]).finally(() => {
        setLoadingSessionDetails(false);
      });
    }
  }, [isOpen, user, sessionId]);

  useEffect(() => {
    if (isOpen) {
      reset({
        title: currentTitle || "New Chat",
        chat_type: currentChatType,
        contact_id: currentContactId || null,
        description: currentDescription,
        voice_enabled: currentVoiceEnabled
      });
    }
  }, [isOpen, currentTitle, currentChatType, currentContactId, currentDescription, currentVoiceEnabled, reset]);

  const loadContacts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
      
      if (!error) {
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
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('created_by_user_id', user.id)
        .order('name');
      
      if (!error) {
        setTags(data || []);
      }
    } catch (error) {
      console.error('Exception loading tags:', error);
      setTags([]);
    }
  };

  const loadSessionTags = async () => {
    if (!sessionId) return;
    
    try {
      const { data } = await supabase
        .from('chat_session_tags')
        .select('tag_id')
        .eq('chat_session_id', sessionId);
      
      if (data) {
        setSelectedTags(data.map(item => item.tag_id));
      }
    } catch (error) {
      console.error('Exception loading session tags:', error);
    }
  };

  const handleTagToggle = async (tagId: string) => {
    if (!sessionId) return;
    
    const isSelected = selectedTags.includes(tagId);
    
    try {
      if (isSelected) {
        await supabase
          .from('chat_session_tags')
          .delete()
          .eq('chat_session_id', sessionId)
          .eq('tag_id', tagId);
        
        setSelectedTags(prev => prev.filter(id => id !== tagId));
      } else {
        await supabase
          .from('chat_session_tags')
          .insert({
            chat_session_id: sessionId,
            tag_id: tagId
          });
        
        setSelectedTags(prev => [...prev, tagId]);
      }
    } catch (error) {
      console.error('Error toggling tag:', error);
    }
  };

  const onSubmit = async (data: ChatSessionData) => {
    setIsSubmitting(true);
    try {
      onSave(data);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving chat session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sessionId) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-background">
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-destructive" />
            </div>
            <DialogTitle className="text-lg font-semibold text-foreground mb-2">
              No Active Chat
            </DialogTitle>
            <p className="text-muted-foreground mb-6">
              This feature is only available within an active chat session.
            </p>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-hidden p-0 bg-background border-border/20 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Modern Header with Gradient */}
          <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-foreground">
                  Chat Session Settings
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure your chat session preferences and details
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {loadingSessionDetails ? (
              <div className="flex items-center justify-center h-48">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Loading session details...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                {/* Session Overview Card */}
                <div className="bg-muted/30 rounded-xl p-5 border border-border/20">
                  <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Session Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Session ID</Label>
                      <div className="bg-background rounded-lg p-3 border border-border/20">
                        <code className="text-xs text-foreground font-mono break-all">
                          {sessionId}
                        </code>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                      <div className="bg-background rounded-lg p-3 border border-border/20">
                        <span className="text-sm text-foreground">Just now</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Information Card */}
                <div className="bg-card rounded-xl p-6 border border-border/20 shadow-sm">
                  <h3 className="text-lg font-medium text-foreground mb-5 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Basic Information
                  </h3>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-foreground">
                        Chat Title
                      </Label>
                      <Input
                        id="title"
                        {...register("title")}
                        placeholder="Enter a descriptive title for this chat"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border/40 focus:border-primary/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-foreground">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Add a brief description of this chat session"
                        className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border/40 focus:border-primary/50 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Configuration Card */}
                <div className="bg-card rounded-xl p-6 border border-border/20 shadow-sm">
                  <h3 className="text-lg font-medium text-foreground mb-5 flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-primary" />
                    Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="chat_type" className="text-sm font-medium text-foreground">
                        Chat Type
                      </Label>
                      <Select onValueChange={(value) => setValue("chat_type", value)} value={watch("chat_type") || ""}>
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border/40">
                          <SelectValue placeholder="Select chat type" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg">
                          {CHAT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="focus:bg-accent">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_id" className="text-sm font-medium text-foreground">
                        Associated Contact
                      </Label>
                      <Select onValueChange={(value) => setValue("contact_id", value === "none" ? null : value)} value={watch("contact_id") || "none"}>
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border/40">
                          <SelectValue placeholder="Select contact" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg">
                          <SelectItem value="none" className="focus:bg-accent">No contact</SelectItem>
                          {contacts.map((contact) => (
                            <SelectItem key={contact.id} value={contact.id} className="focus:bg-accent">
                              {contact.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Voice Settings */}
                  <div className="mt-6 pt-6 border-t border-border/20">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mic className="w-4 h-4 text-primary" />
                          <Label htmlFor="voice_enabled" className="text-sm font-medium text-foreground">
                            Voice Responses
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Enable automatic voice reading of AI responses
                        </p>
                      </div>
                      <Switch
                        id="voice_enabled"
                        checked={watch("voice_enabled") || false}
                        onCheckedChange={(checked) => setValue("voice_enabled", checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Tags Card */}
                <div className="bg-card rounded-xl p-6 border border-border/20 shadow-sm">
                  <h3 className="text-lg font-medium text-foreground mb-5 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    Tags
                  </h3>
                  {tags.length === 0 ? (
                    <div className="text-center py-8">
                      <Tag className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No tags available</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Tags help organize and categorize your chats
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagToggle(tag.id)}
                          className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                            selectedTags.includes(tag.id)
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border/10">
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
                    disabled={isSubmitting}
                    className="px-6 bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                        Saving...
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}