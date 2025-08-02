import React from "react";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatFABProps {
  onClick: () => void;
  className?: string;
  bottomOffset?: number;
}

export function ChatFAB({ onClick, className, bottomOffset = 80 }: ChatFABProps) {
  const handleClick = () => {
    console.log('ChatFAB clicked - opening modal');
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "fixed right-4 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 flex items-center justify-center",
        className
      )}
      style={{ bottom: `${bottomOffset}px` }}
      aria-label="Chat session settings"
    >
      <Settings className="w-6 h-6" />
    </button>
  );
}