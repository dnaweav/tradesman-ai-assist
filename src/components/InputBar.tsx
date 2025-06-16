
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Calendar, Globe } from "lucide-react";

export function InputBar({
  value,
  onChange,
  ...props
}: {
  value: string;
  onChange: (v: string) => void;
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
    </div>
  );
}
