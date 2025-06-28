
import * as React from "react";
import { ArrowLeft, Info, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ChatHeaderProps {
  title: string;
  onBack: () => void;
  isAutoReadEnabled: boolean;
  onAutoReadToggle: (enabled: boolean) => void;
}

export function ChatHeader({ title, onBack, isAutoReadEnabled, onAutoReadToggle }: ChatHeaderProps) {
  return (
    <header className="fixed top-0 w-full px-4 py-3 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="flex items-center justify-between">
        {/* Left side - Back button and title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h1>
        </div>

        {/* Right side - Auto-read toggle and info button */}
        <div className="flex items-center gap-3">
          {/* Auto-read toggle */}
          <div className="flex items-center gap-2">
            {isAutoReadEnabled ? (
              <Volume2 className="w-4 h-4 text-blue-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
            <Switch
              checked={isAutoReadEnabled}
              onCheckedChange={onAutoReadToggle}
              className="scale-75"
            />
          </div>

          {/* Job Info button (placeholder for future) */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
          >
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
