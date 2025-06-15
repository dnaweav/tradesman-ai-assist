
import * as React from "react";
import { Sun, Moon, Menu } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { HamburgerMenu } from "@/components/HamburgerMenu";

const AVATAR_SRC =
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=96&h=96&fit=facearea&facepad=2&q=80";

export function TopNav() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="z-30 w-full flex items-center justify-between py-3 px-4 relative bg-transparent">
      {/* (Optional) Logo in top left for brand, otherwise leave empty */}
      <div className="flex-1"></div>
      {/* Avatar and Hamburger (right-aligned, but reversed order for RTL) */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Hamburger (left of avatar) */}
        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition backdrop-blur active:scale-95"
          type="button"
          style={{ zIndex: 2 }}
        >
          <Menu className="text-white" size={22} />
        </button>
        <img
          src={AVATAR_SRC}
          className="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow"
          alt="User avatar"
        />
      </div>
      {/* Hamburger Slide-in Drawer */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <HamburgerMenu onClose={() => setMenuOpen(false)} />
      </Sheet>
    </header>
  );
}
