
import * as React from "react";
import { ThemePopover } from "./ThemePopover";
import { Avatar } from "@/components/ui/avatar";
import { Logo } from "./Logo";

export function TopNav() {
  return (
    <header className="flex items-center justify-between px-2 pt-3 pb-2 bg-[#eaeaea] border-b border-[#eaeaea] w-full">
      <div className="flex items-center space-x-2">
        <Logo size={40} />
        <span className="font-extrabold text-lg tracking-tight text-[#3b9fe6]">theTradesmen.ai</span>
      </div>
      <div className="flex-1 flex justify-center">
        <ThemePopover />
      </div>
      <div>
        <Avatar>
          {/* Placeholder (user profile img) */}
          <span className="inline-block w-8 h-8 bg-[#3b9fe6] rounded-full text-white font-semibold flex items-center justify-center shadow">
            T
          </span>
        </Avatar>
      </div>
    </header>
  );
}
