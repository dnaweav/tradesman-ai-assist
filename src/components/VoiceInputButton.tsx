
import * as React from "react";
import { Mic } from "lucide-react";

type Props = {
  onClick: () => void;
};

export function VoiceInputButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Voice input"
      className="fixed z-30 bottom-20 right-5 bg-[#ffc000] shadow-lg rounded-full w-16 h-16 flex items-center justify-center border-4 border-white transition-transform active:scale-95 focus:outline-none focus:ring ring-yellow-300 sm:absolute sm:bottom-6 sm:right-6"
      style={{ boxShadow: "0 6px 32px #ffc00055" }}
    >
      <Mic size={32} strokeWidth={1.7} className="text-[#333333]" />
    </button>
  );
}
