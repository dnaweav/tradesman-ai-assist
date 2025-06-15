
import * as React from "react";
import { Home, MessageSquare, Users, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "home", label: "Home", icon: Home },
  { key: "chats", label: "Chats", icon: MessageSquare },
  { key: "clients", label: "Clients", icon: Users },
];

// Optional: floating mic button (FAB)
function FloatingMicButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className={cn(
        "absolute -top-6 left-1/2 -translate-x-1/2 z-20",
        "bg-[#ffc000] hover:bg-yellow-400 text-white rounded-full shadow-xl flex items-center justify-center",
        "h-14 w-14 md:h-16 md:w-16 active:scale-95 transition-all ease-in-out border-4 border-white"
      )}
      style={{
        boxShadow:
          "0 4px 24px 0 rgba(60,60,60,0.18), 0 0 0 4px #fff, 0 1.5px 4px #ffc00060",
      }}
      aria-label="Voice input"
      onClick={onClick}
      tabIndex={0}
    >
      <Mic size={28} className="text-white" />
    </button>
  );
}

export function AppBottomTabs({
  activeTab,
  onTabChange,
  onMicClick, // optional: can be passed from parent
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMicClick?: () => void;
}) {
  return (
    <nav
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[51]",
        "w-[90%] max-w-md px-0"
      )}
      aria-label="Main navigation"
    >
      {/* Floating (+) Mic FAB */}
      <div className="relative flex items-center justify-center">
        <FloatingMicButton onClick={onMicClick} />
      </div>
      <ul
        className={cn(
          "flex items-center justify-around",
          "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-full",
          "px-6 py-3 mt-2 transition-all ease-in-out gap-0"
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <li
              key={tab.key}
              className={cn("flex-1 flex items-center justify-center min-w-[60px]")}
            >
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-full px-2 py-1",
                  "transition-all duration-150 ease-in-out select-none",
                  "text-white/80 font-medium text-xs",
                  "active:scale-95",
                  "hover:scale-105 hover:brightness-125 focus-visible:ring-2 focus-visible:ring-white",
                  isActive
                    ? "ring-2 ring-white ring-offset-1 bg-white/15 font-bold animate-pulse-soft text-white"
                    : "opacity-80 hover:opacity-100"
                )}
                onClick={() => onTabChange(tab.key)}
                aria-current={isActive}
                tabIndex={0}
                style={{
                  minWidth: 58,
                  filter: isActive
                    ? "drop-shadow(0 0 8px #fff) brightness(1.1)"
                    : undefined,
                }}
              >
                <tab.icon
                  size={24}
                  className={cn(
                    "mb-0.5",
                    isActive ? "text-white" : "text-white/80"
                  )}
                  strokeWidth={2.15}
                />
                <span
                  className={cn(
                    "transition font-medium text-xs",
                    isActive ? "font-bold text-white" : "text-white/80"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// Pulse animation for active tab
// Add this to tailwind.config if missing:
/*
'@layer utilities': {
  '.animate-pulse-soft': {
    animation: 'pulse-soft 1.3s cubic-bezier(0.4,0,0.6,1) infinite',
  }
},
keyframes: {
  'pulse-soft': {
    '0%,100%': { boxShadow:'0 0 0 0 rgba(255,255,255,0.4)' },
    '50%': { boxShadow:'0 0 0 4px rgba(255,255,255,0.6)', }
  }
}
*/
