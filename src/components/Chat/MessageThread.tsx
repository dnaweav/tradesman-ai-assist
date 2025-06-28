
import * as React from "react";
import { MessageBubble } from "./MessageBubble";
import { DateDivider } from "./DateDivider";
import { EmptyState } from "./EmptyState";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  created_at: string;
}

interface MessageThreadProps {
  messages: Message[];
  isStreaming: boolean;
  isAutoReadEnabled: boolean;
}

export function MessageThread({ messages, isStreaming, isAutoReadEnabled }: MessageThreadProps) {
  console.log('MessageThread render:', { messagesCount: messages.length, isStreaming });
  
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { speak, stop, isPlaying } = useTextToSpeech();
  const lastAiMessageRef = React.useRef<string>('');

  // Group messages by date - moved to top to fix hook order
  const groupedMessages = React.useMemo(() => {
    console.log('Grouping messages:', messages.length);
    
    if (!messages || messages.length === 0) {
      return [];
    }

    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';
    let currentGroup: Message[] = [];

    messages.forEach((message) => {
      const messageDate = new Date(message.created_at).toDateString();
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  // Auto-read new AI messages
  React.useEffect(() => {
    if (!isAutoReadEnabled || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender === 'ai' && lastMessage.content !== lastAiMessageRef.current) {
      lastAiMessageRef.current = lastMessage.content;
      speak(lastMessage.content);
    }
  }, [messages, isAutoReadEnabled, speak]);

  // Stop reading when component unmounts
  React.useEffect(() => {
    return () => stop();
  }, [stop]);

  if (messages.length === 0 && !isStreaming) {
    return <EmptyState />;
  }

  return (
    <div 
      ref={scrollRef}
      className="h-full overflow-y-auto px-4 py-4 space-y-4"
    >
      {groupedMessages.map((group, groupIndex) => (
        <div key={group.date}>
          <DateDivider date={group.date} />
          <div className="space-y-3 mt-4">
            {group.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onCopy={() => navigator.clipboard.writeText(message.content)}
              />
            ))}
          </div>
        </div>
      ))}
      
      {/* Streaming indicator */}
      {isStreaming && (
        <div className="flex justify-start">
          <div className="bg-gray-100 rounded-xl px-4 py-3 max-w-[80%]">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
