
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
  return (
    <div className="relative flex flex-col gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/20 px-4 py-3 transition-all duration-200">
      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        className="min-h-[48px] max-h-[160px] resize-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-white py-2 px-0 whitespace-pre-wrap break-words transition-all ease-in-out duration-200 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent overflow-y-auto"
        rows={1}
      />

      {/* Buttons Row */}
      <div className="flex items-center justify-between gap-3">
        {/* Attachment Button - Always visible */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-200 transition-all duration-200"
          onClick={onAttachmentClick}
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Send Button - Only visible when there's content or attachments */}
        {(hasContent || hasAttachments) && (
          <Button
            type="button"
            onClick={onSend}
            disabled={!hasContent && !hasAttachments}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
            size="icon"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
