
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Paperclip } from "lucide-react";

interface InputContainerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onAttachmentClick: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  hasContent: boolean;
  hasAttachments: boolean;
  placeholder: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export function InputContainer({
  value,
  onChange,
  onSend,
  onAttachmentClick,
  onKeyPress,
  hasContent,
  hasAttachments,
  placeholder,
  textareaRef
}: InputContainerProps) {
  const shouldShowSendButton = hasContent || hasAttachments;
  const shouldShowAttachmentButton = !hasContent && !hasAttachments;

  console.log('InputContainer render state:', { 
    hasContent, 
    hasAttachments, 
    shouldShowSendButton, 
    shouldShowAttachmentButton,
    valueLength: value.length 
  });

  return (
    <div className="relative flex items-end gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/20 px-4 py-2 transition-all duration-200">
      {/* Attachment Button - Only render when conditions are met */}
      {shouldShowAttachmentButton && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-200 transition-all duration-200"
          onClick={onAttachmentClick}
        >
          <Paperclip className="w-5 h-5" />
        </Button>
      )}

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        className="flex-1 min-h-[48px] max-h-[160px] resize-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-white py-2 px-0 whitespace-pre-wrap break-words transition-all ease-in-out duration-200 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent overflow-y-auto"
        rows={1}
      />

      {/* Send Button - Only render when content or attachments exist */}
      {shouldShowSendButton && (
        <Button
          type="button"
          onClick={onSend}
          disabled={!shouldShowSendButton}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
          size="icon"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
