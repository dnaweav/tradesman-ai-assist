
import * as React from "react";
import { Home, MessageSquare, Users, File, User, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "home", label: "Home", icon: Home },
  { key: "chats", label: "Chats", icon: MessageSquare },
  { key: "clients", label: "Clients", icon: Users },
  { key: "docs", label: "Docs", icon: File },
  { key: "profile", label: "Profile", icon: User },
  { key: "support", label: "Support", icon: LifeBuoy },
];

export function AppBottomTabs({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 pb-safe pointer-events-none"
      style={{}}
      aria-label="Main navigation"
    >
      <div className="w-full flex justify-center items-center">
        <ul
          className="flex gap-2 bg-white/80 dark:bg-[#222e]/80 shadow-xl border border-[#eaeaea]/80 rounded-full px-3 py-1 mt-2 mx-auto
                [&>*]:pointer-events-auto pointer-events-auto
                max-w-xs w-full sm:max-w-sm
                backdrop-blur-xl transition duration-300 "
        >
          {tabs.map((tab) => (
            <li key={tab.key} className="flex-1 min-w-0">
              <button
                className={cn(
                  "flex flex-col items-center justify-center px-2 py-2 rounded-lg transition min-w-0",
                  activeTab === tab.key
                    ? "text-[#3b9fe6] font-bold bg-[#e9f6ff] shadow-[0_0_8px_2px_#3b9fe655] ring-2 ring-[#3b9fe6] scale-105"
                    : "text-[#333333] hover:text-[#3b9fe6] opacity-80"
                )}
                style={{
                  minWidth: 0,
                  fontWeight: activeTab === tab.key ? 700 : 500,
                  letterSpacing: activeTab === tab.key ? "0.01em" : undefined,
                }}
                onClick={() => onTabChange(tab.key)}
                aria-current={activeTab === tab.key}
                tabIndex={0}
              >
                <tab.icon size={22} />
                <span className={cn("text-xs mt-0.5 truncate", activeTab === tab.key ? "text-[#3b9fe6]" : "")}>
                  {tab.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
