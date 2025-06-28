
import * as React from "react";
import { AttachmentPreview } from "./InputBar/AttachmentPreview";
import { AttachmentSheet } from "./InputBar/AttachmentSheet";
import { InputContainer } from "./InputBar/InputContainer";
import { AttachmentFile, InputBarProps } from "./InputBar/types";

export function InputBar({ value, onChange, onSend, onHeightChange, placeholder = "Describe the job, follow-up or task…" }: InputBarProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const [attachments, setAttachments] = React.useState<AttachmentFile[]>([]);
  const [showAttachmentSheet, setShowAttachmentSheet] = React.useState(false);

  // Calculate and emit total footer height including bottom navigation
  const updateFooterHeight = React.useCallback(() => {
    if (containerRef.current && onHeightChange) {
      const containerHeight = containerRef.current.offsetHeight;
      const navHeight = 60; // Bottom navigation height
      const totalHeight = containerHeight + navHeight;
      onHeightChange(totalHeight);
    }
  }, [onHeightChange]);

  // Auto-resize textarea based on content
  const adjustTextareaHeight = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '48px';
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 48), 160);
      textarea.style.height = `${newHeight}px`;
      setTimeout(updateFooterHeight, 0);
    }
  }, [updateFooterHeight]);

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [value, attachments, adjustTextareaHeight]);

  React.useEffect(() => {
    const timer = setTimeout(updateFooterHeight, 100);
    return () => clearTimeout(timer);
  }, [updateFooterHeight]);

  const handleSend = () => {
    if (!value.trim() && attachments.length === 0) return;
    
    const files = attachments.map(att => att.file);
    onSend?.(value, files);
    
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

  // Debug logging to help troubleshoot
  console.log('InputBar state:', { value, hasContent, attachmentsCount: attachments.length });

  return (
    <div ref={containerRef} className="w-full px-4 py-3 pb-6">
      <AttachmentPreview 
        attachments={attachments}
        onRemove={removeAttachment}
      />

      <InputContainer
        value={value}
        onChange={onChange}
        onSend={handleSend}
        onAttachmentClick={() => setShowAttachmentSheet(true)}
        onKeyPress={handleKeyPress}
        hasContent={hasContent}
        hasAttachments={attachments.length > 0}
        placeholder={placeholder}
        textareaRef={textareaRef}
      />

      <AttachmentSheet
        open={showAttachmentSheet}
        onOpenChange={setShowAttachmentSheet}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
}
