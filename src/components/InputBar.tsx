
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Mic, Upload, Calendar, Globe } from "lucide-react";

export function InputBar({
  value,
  onChange,
  onMic,
  micActive,
  ...props
}: {
  value: string;
  onChange: (v: string) => void;
  onMic?: () => void;
  micActive?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-2 rounded-full px-6 py-3 bg-white/10 backdrop-blur-md text-white w-full max-w-xl shadow-lg border border-white/15"
      tabIndex={-1}
    >
      {/* Optional leading icons */}
      <div className="flex gap-1 mr-2">
        <Button type="button" variant="ghost" size="icon" className="text-white/70 hover:bg-white/15" tabIndex={-1}>
          <Upload size={19} />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="text-white/70 hover:bg-white/15" tabIndex={-1}>
          <Calendar size={19} />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="text-white/70 hover:bg-white/15" tabIndex={-1}>
          <Globe size={19} />
        </Button>
      </div>
      <input
        className="flex-1 bg-transparent border-none outline-none placeholder-white/60 text-white text-base md:text-lg font-normal"
        placeholder="Describe the job, follow-up or task…"
        value={value}
        onChange={e => onChange(e.target.value)}
        {...props}
      />
      <Button
        type="button"
        size="icon"
        variant="secondary"
        aria-label="Start voice input"
        onClick={onMic}
        className={`ml-2 rounded-full bg-[#ffc000] hover:bg-[#ffd850] text-[#20232a] shadow-lg focus-visible:ring-2 focus-visible:ring-yellow-300 transition-all ${micActive ? "scale-110 animate-pulse-glow" : "active:scale-95"}`}
        tabIndex={0}
      >
        <Mic size={22} strokeWidth={2} />
      </Button>
    </div>
  );
}
