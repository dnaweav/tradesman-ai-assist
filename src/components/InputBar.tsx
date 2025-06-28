
import * as React from "react";
import { Button } from "@/components/ui/button";
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
  placeholder?: string;
}

export function InputBar({ value, onChange, onSend, placeholder = "Describe the job, follow-up or task…" }: InputBarProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const galleryInputRef = React.useRef<HTMLInputElement>(null);
  
  const [attachments, setAttachments] = React.useState<AttachmentFile[]>([]);
  const [showAttachmentSheet, setShowAttachmentSheet] = React.useState(false);
  
  // Auto-resize textarea with smooth transitions
  const adjustTextareaHeight = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to calculate new scroll height
    textarea.style.height = '48px'; // min-h-[48px] equivalent
    
    // Calculate new height, capped at max height
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 160; // max-h-[160px] equivalent
    const newHeight = Math.min(scrollHeight, maxHeight);
    
    textarea.style.height = `${Math.max(newHeight, 48)}px`;
  }, []);

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [value, adjustTextareaHeight]);

  const handleSend = () => {
    if (!value.trim() && attachments.length === 0) return;
    
    const files = attachments.map(att => att.file);
    onSend?.(value, files);
    
    // Clear input and attachments
    onChange('');
    setAttachments([]);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
    }
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const hasContent = value.trim().length > 0;

  return (
    <div className="w-full px-4 pb-2">
      {/* File Previews */}
      {attachments.length > 0 && (
        <div className="mb-3 animate-in slide-in-from-bottom-2 duration-200">
          <div className={`flex gap-2 ${attachments.length > 2 ? 'overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent pb-2' : 'flex-wrap'}`}>
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-3 border border-white/20 dark:border-gray-700/20 shadow-sm transition-all duration-200 hover:shadow-md flex-shrink-0"
              >
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-md transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                  type="button"
                  aria-label={`Remove ${attachment.file.name}`}
                  tabIndex={0}
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                
                {attachment.type === 'image' && attachment.preview ? (
                  <img
                    src={attachment.preview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <File className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                  </div>
                )}
                
                <div className="mt-2 max-w-16">
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-medium truncate">
                    {attachment.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(attachment.file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Container */}
      <div className="relative flex items-end gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-md px-4 py-3 transition-all duration-200">
        {/* Attachment Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="flex-shrink-0 w-10 h-10 text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-gray-700/20 hover:text-gray-800 dark:hover:text-gray-200 rounded-full transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          onClick={() => setShowAttachmentSheet(true)}
          aria-label="Add attachment"
          tabIndex={0}
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          aria-label="Describe the job, follow-up or task"
          className="flex-1 min-h-[48px] max-h-[160px] resize-none whitespace-pre-wrap break-words overflow-hidden border-none bg-transparent focus-visible:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-white py-0 px-0 transition-all ease-in-out duration-200 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500"
          style={{ 
            height: '48px',
            lineHeight: '1.5',
            fontFamily: 'inherit'
          }}
          rows={1}
        />

        {/* Send Button */}
        <Button
          type="button"
          onClick={handleSend}
          disabled={!hasContent && attachments.length === 0}
          className={`flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-md transition-all duration-200 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
            hasContent || attachments.length > 0 
              ? 'opacity-100 scale-100 translate-x-0' 
              : 'opacity-0 scale-75 translate-x-2 pointer-events-none'
          }`}
          size="icon"
          aria-label="Send message"
          tabIndex={hasContent || attachments.length > 0 ? 0 : -1}
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      </div>

      {/* Attachment Sheet */}
      <Sheet open={showAttachmentSheet} onOpenChange={setShowAttachmentSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl border-t border-gray-200 dark:border-gray-700">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-lg font-semibold">Add Attachment</SheetTitle>
          </SheetHeader>
          
          <div className="grid grid-cols-3 gap-4 pb-6">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              type="button"
              aria-label="Take photo with camera"
              tabIndex={0}
            >
              <Camera className="w-8 h-8 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Camera</span>
            </button>

            <button
              onClick={() => galleryInputRef.current?.click()}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              type="button"
              aria-label="Choose image from gallery"
              tabIndex={0}
            >
              <Image className="w-8 h-8 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Gallery</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              type="button"
              aria-label="Select file"
              tabIndex={0}
            >
              <File className="w-8 h-8 text-purple-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">File</span>
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
        aria-hidden="true"
        tabIndex={-1}
      />
      
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files, 'gallery')}
        aria-hidden="true"
        tabIndex={-1}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files, 'file')}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
