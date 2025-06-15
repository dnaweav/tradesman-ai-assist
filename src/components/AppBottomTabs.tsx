
import * as React from "react";
import { Home, MessageSquare, Users, Mic, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "home", label: "Home", icon: Home },
  { key: "chats", label: "Chats", icon: MessageSquare },
  { key: "clients", label: "Clients", icon: Users },
  { key: "promo", label: "Promo", icon: Megaphone },
];

// Floating mic button, positioned between Clients and Promo
function FloatingMicButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className={cn(
        "absolute -top-6 left-1/2 -translate-x-[65%] z-20", // Shift left to sit between 3rd and 4th tab, 65% is visually balanced
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
      type="button"
    >
      <Mic size={28} className="text-white" />
    </button>
  );
}

export function AppBottomTabs({
  activeTab,
  onTabChange,
  onMicClick,
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
      <div className="relative flex items-center justify-center">
        {/* Floating Mic FAB (between Clients and Promo) */}
        <FloatingMicButton onClick={onMicClick} />
      </div>
      <ul
        className={cn(
          "flex items-center justify-around w-full",
          "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-full",
          "px-6 py-3 mt-2 transition-all ease-in-out gap-0"
        )}
      >
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.key;
          return (
            <li
              key={tab.key}
              className={cn(
                "flex-1 flex items-center justify-center min-w-[60px]"
              )}
            >
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-full px-2 py-1",
                  "transition-all duration-150 ease-in-out select-none",
                  "text-xs font-medium",
                  isActive
                    ? "font-semibold text-white"
                    : "text-white/80",
                  "active:scale-95 hover:opacity-100 focus-visible:ring-0",
                  !isActive && "opacity-80"
                )}
                onClick={() => onTabChange(tab.key)}
                aria-current={isActive}
                tabIndex={0}
                style={{
                  minWidth: 58,
                  // Slight scale for active, subtle underline
                  transform: isActive ? "scale(1.06)" : undefined,
                }}
              >
                <tab.icon
                  size={24}
                  className={cn(
                    "mb-0.5 transition-opacity duration-100",
                    isActive
                      ? "text-white opacity-100"
                      : "text-white/80 opacity-60"
                  )}
                  strokeWidth={2.15}
                />
                <span
                  className={cn(
                    "transition font-medium text-xs",
                    isActive
                      ? "font-semibold text-white"
                      : "text-white/80"
                  )}
                  style={
                    isActive
                      ? {
                          borderBottom: "2px solid #fff",
                          paddingBottom: 2,
                          lineHeight: "1",
                        }
                      : undefined
                  }
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
