
import * as React from "react";
import { MessageSquare, Mic, Paperclip } from "lucide-react";

export function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8 text-center">
      <div className="bg-blue-50 rounded-full p-4 mb-4">
        <MessageSquare className="w-8 h-8 text-blue-500" />
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Start your conversation
      </h2>
      
      <p className="text-gray-500 mb-6 max-w-sm">
        Ask about your job, request quotes, or get help with any task. Your AI assistant is ready to help.
      </p>

      <div className="space-y-3 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4" />
          <span>Tap the mic button for voice input</span>
        </div>
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4" />
          <span>Attach photos or documents</span>
        </div>
      </div>
    </div>
  );
}
