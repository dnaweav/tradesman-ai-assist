
import * as React from "react";
import { Home, MessageSquare, Users, File, User, Support } from "lucide-react";

type Props = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const tabs = [
  { key: "home", label: "Home", icon: Home },
  { key: "chats", label: "Chats", icon: MessageSquare },
  { key: "clients", label: "Clients", icon: Users },
  { key: "docs", label: "Docs", icon: File },
  { key: "profile", label: "Profile", icon: User },
  { key: "support", label: "Support", icon: Support },
];

export function AppBottomTabs({ activeTab, onTabChange }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 bg-white border-t border-[#eaeaea] shadow-sm sm:hidden">
      <ul className="flex justify-around w-full h-16">
        {tabs.map((tab) => (
          <li key={tab.key} className="flex-1">
            <button
              className={`flex flex-col items-center justify-center w-full h-full px-1 py-2 transition ${
                activeTab === tab.key ? "text-[#3b9fe6] font-bold" : "text-[#333333] hover:text-[#3b9fe6]"
              }`}
              onClick={() => onTabChange(tab.key)}
            >
              <tab.icon size={24} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
