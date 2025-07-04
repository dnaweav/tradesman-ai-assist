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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Chat Title */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chat Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Chat Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. En-suite Quote for Mr. Smith"
                  {...register("title")}
                />
              </div>
              
              <div>
                <Label htmlFor="chat_type">Chat Type</Label>
                <Select onValueChange={(value) => setValue("chat_type", value)} value={watch("chat_type")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chat type" />
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
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add notes or summary about this chat..."
                  {...register("description")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contact">Assign to Contact</Label>
                <Select onValueChange={(value) => setValue("contact_id", value)} value={watch("contact_id") || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No contact assigned</SelectItem>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name} {contact.email && `(${contact.email})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {showNewContact ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Contact name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                  />
                  <Button type="button" onClick={createContact} size="sm">
                    Add
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewContact(false)} size="sm">
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button type="button" variant="outline" onClick={() => setShowNewContact(true)} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Contact
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="voice_enabled"
                  checked={watchedVoiceEnabled}
                  onCheckedChange={(checked) => setValue("voice_enabled", checked)}
                />
                <Label htmlFor="voice_enabled">Enable voice responses</Label>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">File Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <Label htmlFor="files" className="cursor-pointer text-sm font-medium">
                  Click to upload files or drag and drop
                </Label>
                <Input
                  id="files"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                {files.length > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {files.length} file(s) selected
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

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
        )}
      </DialogContent>
    </Dialog>
  );
}