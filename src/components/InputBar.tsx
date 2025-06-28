
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowUp, Paperclip, Camera, Image, File, X } from "lucide-react";

interface AttachmentFile {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'file';
}

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend?: (message: string, files: File[]) => void;
  onHeightChange?: (height: number) => void;
  placeholder?: string;
}

export function InputBar({ value, onChange, onSend, onHeightChange, placeholder = "Describe the job, follow-up or task…" }: InputBarProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const galleryInputRef = React.useRef<HTMLInputElement>(null);
  
  const [attachments, setAttachments] = React.useState<AttachmentFile[]>([]);
  const [showAttachmentSheet, setShowAttachmentSheet] = React.useState(false);

  // Calculate and emit total footer height
  const updateFooterHeight = React.useCallback(() => {
    if (containerRef.current && onHeightChange) {
      const containerHeight = containerRef.current.offsetHeight;
      const micOverlap = 24; // Mic button overlap
      const navHeight = 60; // Bottom navigation height
      const totalHeight = containerHeight + micOverlap + navHeight;
      onHeightChange(totalHeight);
    }
  }, [onHeightChange]);

  // Auto-resize textarea based on content
  const adjustTextareaHeight = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to get accurate scrollHeight
      textarea.style.height = '48px';
      
      // Calculate new height based on content
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 48), 160);
      textarea.style.height = `${newHeight}px`;
      
      // Update footer height after textarea resize
      setTimeout(updateFooterHeight, 0);
    }
  }, [updateFooterHeight]);

  // Update height when content changes
  React.useEffect(() => {
    adjustTextareaHeight();
  }, [value, attachments, adjustTextareaHeight]);

  // Initial height calculation
  React.useEffect(() => {
    const timer = setTimeout(updateFooterHeight, 100);
    return () => clearTimeout(timer);
  }, [updateFooterHeight]);

  const handleSend = () => {
    if (!value.trim() && attachments.length === 0) return;
    
    const files = attachments.map(att => att.file);
    onSend?.(value, files);
    
    // Clear input and attachments
    onChange('');
    setAttachments([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (files: FileList | null, type: 'camera' | 'gallery' | 'file') => {
    if (!files) return;

    Array.from(files).forEach(file => {
      const id = Math.random().toString(36).substr(2, 9);
      const isImage = file.type.startsWith('image/');
      
      const attachment: AttachmentFile = {
        id,
        file,
        type: isImage ? 'image' : 'file'
      };

      if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          attachment.preview = e.target?.result as string;
          setAttachments(prev => [...prev, attachment]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments(prev => [...prev, attachment]);
      }
    });

    setShowAttachmentSheet(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const hasContent = value.trim().length > 0;

  return (
    <div ref={containerRef} className="w-full px-4 py-3">
      {/* File Previews */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 border border-white/20 dark:border-gray-700/20"
            >
              <button
                onClick={() => removeAttachment(attachment.id)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                type="button"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              
              {attachment.type === 'image' && attachment.preview ? (
                <img
                  src={attachment.preview}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                  <File className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
              )}
              
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate max-w-12">
                {attachment.file.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Input Container */}
      <div className="relative flex items-end gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-white/20 dark:border-gray-700/20 px-4 py-2 transition-all duration-200">
        {/* Attachment Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="flex-shrink-0 w-8 h-8 text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-gray-700/20"
          onClick={() => setShowAttachmentSheet(true)}
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 min-h-[48px] max-h-[160px] resize-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-white py-2 px-0 whitespace-pre-wrap break-words transition-all ease-in-out duration-200 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent overflow-y-auto"
          rows={1}
        />

        {/* Send Button */}
        <Button
          type="button"
          onClick={handleSend}
          disabled={!hasContent && attachments.length === 0}
          className={`flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 ${
            hasContent || attachments.length > 0 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-75 pointer-events-none'
          }`}
          size="icon"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      </div>

      {/* Attachment Sheet */}
      <Sheet open={showAttachmentSheet} onOpenChange={setShowAttachmentSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Add Attachment</SheetTitle>
          </SheetHeader>
          
          <div className="grid grid-cols-3 gap-4 py-6">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              type="button"
            >
              <Camera className="w-8 h-8 text-blue-500" />
              <span className="text-sm font-medium">Camera</span>
            </button>

            <button
              onClick={() => galleryInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              type="button"
            >
              <Image className="w-8 h-8 text-green-500" />
              <span className="text-sm font-medium">Gallery</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              type="button"
            >
              <File className="w-8 h-8 text-purple-500" />
              <span className="text-sm font-medium">File</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Hidden File Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files, 'camera')}
      />
      
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files, 'gallery')}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files, 'file')}
      />
    </div>
  );
}
