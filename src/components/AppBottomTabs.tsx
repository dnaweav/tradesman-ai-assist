
import * as React from "react";
import { Home, MessageSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";

// Only 3 tabs now with new icon set and new styling
const tabs = [
  { key: "home", label: "Home", icon: Home },
  { key: "chats", label: "Chats", icon: MessageSquare },
  { key: "clients", label: "Clients", icon: Users },
];

export function AppBottomTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <nav
      className="fixed bottom-4 inset-x-0 flex justify-center z-40 pointer-events-none"
      aria-label="Main navigation"
    >
      <ul
        className="
        flex gap-2 bg-white/90 dark:bg-[#222e]/85 shadow-xl border border-[#eaeaea]/80 rounded-full 
        px-2 py-1 mx-auto
        pointer-events-auto
        min-w-[240px] max-w-sm w-auto
        backdrop-blur-xl transition duration-300 ease-in-out
        "
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <li key={tab.key} className="flex-1 min-w-0">
              <button
                className={cn(
                  "flex flex-col items-center justify-center px-4 py-2 rounded-xl transition min-w-0 focus:outline-none",
                  isActive
                    ? "bg-white/90 shadow-[0_0_8px_2px_#fff6] font-semibold border-2 border-white text-[#3b9fe6] scale-105"
                    : "text-[#333] dark:text-white/70 hover:text-[#3b9fe6] opacity-80"
                )}
                style={{
                  minWidth: 0,
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: isActive ? "0.01em" : undefined,
                }}
                onClick={() => onTabChange(tab.key)}
                aria-current={isActive}
                tabIndex={0}
              >
                <tab.icon size={24} className={isActive ? "text-[#3b9fe6]" : ""} />
                <span className={cn("text-xs mt-0.5 truncate", isActive ? "text-[#3b9fe6]" : "")}>
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
