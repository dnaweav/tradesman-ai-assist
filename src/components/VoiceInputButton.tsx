
import * as React from "react";
import { Mic } from "lucide-react";

// Pulse and ripple on press
export function VoiceInputButton({ onClick }: { onClick: () => void }) {
  const [rippling, setRippling] = React.useState(false);

  function handleClick() {
    setRippling(true);
    onClick();
    setTimeout(() => setRippling(false), 400); // Ripple duration
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Voice input"
      className="fixed z-40 bottom-24 right-5 sm:bottom-8 sm:right-8 bg-[#ffc000] shadow-xl rounded-full w-16 h-16 flex items-center justify-center border-4 border-white transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-300"
      style={{ boxShadow: "0 8px 32px #ffc00040" }}
    >
      <span className="absolute inset-0 pointer-events-none">
        {/* Glow Pulse */}
        <span className="block w-full h-full rounded-full animate-pulse-glow bg-[#ffc000]/60" />
        {/* Ripple */}
        {rippling && (
          <span className="block absolute top-1/2 left-1/2 w-full h-full bg-[#ffe066]/60 rounded-full animate-ripple -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        )}
      </span>
      <Mic size={32} strokeWidth={1.7} className="text-[#333333] relative z-10" />
    </button>
  );
}
