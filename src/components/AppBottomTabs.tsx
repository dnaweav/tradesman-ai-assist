
import * as React from "react";
import { Home, MessageSquare, Users, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "home", label: "Home", icon: Home },
  { key: "chats", label: "Chats", icon: MessageSquare },
  { key: "clients", label: "Clients", icon: Users },
  { key: "promo", label: "Promo", icon: Megaphone },
];

export function AppBottomTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-full px-4 py-2 flex justify-between items-center z-30">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 ease-in-out active:scale-95",
              isActive
                ? "text-white font-semibold"
                : "text-white/80 font-medium"
            )}
            onClick={() => onTabChange(tab.key)}
            aria-current={isActive}
          >
            <tab.icon
              className={cn(
                "w-5 h-5 mb-0.5 transition-opacity duration-100",
                isActive ? "opacity-100" : "opacity-80"
              )}
              strokeWidth={2}
            />
            <span className="text-xs">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
