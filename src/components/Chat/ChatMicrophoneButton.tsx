import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMicrophoneButtonProps {
  onMicClick: () => void;
  isKeyboardVisible: boolean;
}

export function ChatMicrophoneButton({ onMicClick, isKeyboardVisible }: ChatMicrophoneButtonProps) {
  return (
    <div className={cn(
      "fixed left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300 ease-in-out",
      isKeyboardVisible 
        ? "opacity-0 pointer-events-none scale-95 translate-y-4" 
        : "opacity-100 scale-100 translate-y-0"
    )} style={{ bottom: "140px" }}>
      <button
        className="w-12 h-12 rounded-full border-3 border-white bg-[#ffc000] shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-150"
        style={{ boxShadow: "0 8px 32px #ffc00040" }}
        aria-label="Voice input"
        onClick={onMicClick}
        type="button"
      >
        <Mic className="w-5 h-5 text-black" strokeWidth={2} />
      </button>
    </div>
  );
}