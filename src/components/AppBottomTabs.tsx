
import * as React from "react";
import { Home, MessageSquare, Users, Mic, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "home", label: "Home", icon: Home },
  { key: "chats", label: "Chats", icon: MessageSquare },
  { key: "clients", label: "Clients", icon: Users },
  { key: "promo", label: "Promo", icon: Megaphone },
];

function FloatingMicButton({ onClick }: { onClick?: () => void }) {
  // Placed between Clients and Promo tab
  return (
    <button
      className={cn(
        "absolute -top-6 left-1/2 -translate-x-[65%] z-20",
        "bg-[#ffc000] hover:bg-yellow-400 text-white rounded-full shadow-xl flex items-center justify-center",
        "h-14 w-14 md:h-16 md:w-16 active:scale-95 transition-all border-4 border-white"
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
      <Mic className="w-7 h-7 text-white" />
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
        "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-full",
        "px-4 py-3 max-w-md w-[90%] transition-all ease-in-out"
      )}
      aria-label="Main navigation"
    >
      {/* Floating Mic Button: positioned above the center gap */}
      <div className="relative w-full h-0 flex items-center justify-center">
        <FloatingMicButton onClick={onMicClick} />
      </div>
      <ul
        className={cn(
          "flex justify-around items-center w-full gap-0 mt-0"
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <li key={tab.key} className="flex-1 min-w-0 flex">
              <button
                type="button"
                className={cn(
                  "w-full flex flex-col items-center justify-center gap-1 flex-1 min-w-0",
                  "rounded-full select-none group",
                  "transition-all duration-150 ease-in-out",
                  "text-xs font-medium py-1 px-2",
                  isActive
                    ? "text-white font-semibold"
                    : "text-white/80",
                  "active:scale-95 hover:opacity-100 focus-visible:outline-none"
                )}
                onClick={() => onTabChange(tab.key)}
                aria-current={isActive}
                tabIndex={0}
                style={{
                  transform: isActive ? "scale(1.06)" : undefined,
                  minWidth: 0,
                }}
              >
                <tab.icon
                  className={cn(
                    "w-5 h-5 transition-opacity duration-100",
                    isActive ? "opacity-100" : "opacity-60"
                  )}
                  strokeWidth={2.15}
                />
                <span
                  className={cn(
                    "transition text-xs",
                    isActive
                      ? "text-white font-semibold"
                      : "text-white/80 font-medium"
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

