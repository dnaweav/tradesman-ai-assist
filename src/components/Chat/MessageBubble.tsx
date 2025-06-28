
import * as React from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  created_at: string;
}

interface MessageBubbleProps {
  message: Message;
  onCopy: () => void;
}

export function MessageBubble({ message, onCopy }: MessageBubbleProps) {
  const [copied, setCopied] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleCopy = async () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.sender === 'user';

  // Simple markdown rendering for AI messages
  const renderContent = (content: string) => {
    if (isUser) return content;

    // Basic markdown parsing
    let rendered = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/\n/g, '<br>') // Line breaks
      .replace(/- (.*?)(<br>|$)/g, '• $1$2'); // Simple bullet points

    return <div dangerouslySetInnerHTML={{ __html: rendered }} />;
  };

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative group max-w-[80%] rounded-xl px-4 py-3 shadow-sm transition-all duration-200",
          isUser
            ? "bg-blue-500 text-white ml-4"
            : "bg-white text-gray-900 mr-4 border border-gray-200"
        )}
      >
        {/* Copy button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className={cn(
            "absolute -top-1 -right-1 w-6 h-6 rounded-full transition-all duration-200",
            isUser 
              ? "bg-blue-400 hover:bg-blue-300 text-white" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-600",
            (isHovered || copied) ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          {copied ? (
            <Check className="w-3 h-3" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>

        {/* Message content */}
        <div className="text-sm leading-relaxed">
          {renderContent(message.content)}
        </div>

        {/* Timestamp */}
        <div
          className={cn(
            "text-xs mt-1 opacity-70",
            isUser ? "text-blue-100" : "text-gray-500"
          )}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
}
