
import * as React from "react";
import { Button } from "@/components/ui/button";

const PROMPTS = [
  "Create a quote",
  "Follow up with a client",
  "Send an invoice",
  "Post to Facebook",
  "Remind me Thursday",
  "More…",
];

export function PromptPills({ onPrompt }: { onPrompt?: (p: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-xl mx-auto mt-4">
      {PROMPTS.map((prompt) => (
        <Button
          key={prompt}
          type="button"
          variant="ghost"
          className="rounded-full px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-white/90 shadow transition-all duration-150 ease-in-out focus-visible:ring-2 focus-visible:ring-white/50 active:scale-95"
          onClick={() => onPrompt?.(prompt)}
        >
          {prompt}
        </Button>
      ))}
    </div>
  );
}
