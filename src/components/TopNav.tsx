
import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/lovable-uploads/e9f7f372-2dd2-45bb-aefd-a4504a9f0249.png";
const AVATAR_SRC = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=96&h=96&fit=facearea&facepad=2&q=80";

// Return a part of day greeting: "Morning", "Afternoon", "Evening"
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 18) return "Afternoon";
  return "Evening";
}

// Animated sun/moon theme toggle
function ThemeToggle() {
  const [mode, setMode] = React.useState<"light" | "dark">(
    () =>
      typeof window !== "undefined" && window.localStorage.getItem("tmode") === "dark"
        ? "dark"
        : "light"
  );
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    window.localStorage.setItem("tmode", mode);
  }, [mode]);

  return (
    <button
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/70 hover:bg-[#3b9fe6]/10 transition"
      aria-label="Toggle theme"
      onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
    >
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-transform duration-300",
          mode === "dark" ? "scale-0 rotate-180" : "scale-100 rotate-0"
        )}
      >
        <Sun className="text-yellow-400" size={24} />
      </span>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-transform duration-300",
          mode === "light" ? "scale-0 rotate-180" : "scale-100 rotate-0"
        )}
      >
        <Moon className="text-[#333]" size={22} />
      </span>
    </button>
  );
}

export function TopNav() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full px-4 py-2 flex items-center justify-between transition [backdrop-filter:saturate(180%)_blur(10px)] bg-white/70 dark:bg-[#222c] border-b border-[#eaeaea]/90",
        scrolled ? "shadow-md" : "shadow-none"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={LOGO_SRC} alt="TheTradesmen.ai Logo" className="w-9 h-9 rounded-xl object-contain bg-[#eaeaea] shadow-sm" />
      </div>
      {/* Greeting */}
      <span className="text-xl font-semibold tracking-tight text-[#3b9fe6] text-center flex-1 -ml-10 justify-center flex">
        {getGreeting()}, Alex <span className="ml-1">👋</span>
      </span>
      {/* Actions: Theme + Avatar */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <img
          src={AVATAR_SRC}
          className="w-10 h-10 rounded-full object-cover border-2 border-[#3b9fe6]/10 shadow"
          alt="User avatar"
        />
      </div>
    </header>
  );
}
