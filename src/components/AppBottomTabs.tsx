
import * as React from "react";
import { Home, MessageSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";

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
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-50"
      aria-label="Main navigation"
    >
      <ul
        className={cn(
          "flex justify-around items-center rounded-full shadow-lg bg-white/20 backdrop-blur border border-white/30",
          "py-2 px-3 gap-1"
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <li key={tab.key} className="flex-1">
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center rounded-full px-3 py-1.5 transition-all",
                  "active:scale-95 hover:scale-105",
                  isActive
                    ? "bg-white/25 shadow ring-2 ring-white/80 text-white opacity-100"
                    : "bg-transparent text-white opacity-80 hover:opacity-100"
                )}
                style={{
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: isActive ? "0.01em" : undefined,
                  boxShadow: isActive
                    ? "0 0 0 2px #fff, 0 0 6px #fff9"
                    : undefined,
                }}
                onClick={() => onTabChange(tab.key)}
                aria-current={isActive}
                tabIndex={0}
              >
                <tab.icon size={24} className="mb-0.5" strokeWidth={2.1} />
                <span className="text-xs">{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
