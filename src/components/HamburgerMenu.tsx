
import * as React from "react";
import {
  User,
  File,
  Settings,
  BookOpen,
  LifeBuoy,
  Sun,
  Moon,
  ArrowRight
} from "lucide-react";

export function HamburgerMenu({ onClose }: { onClose: () => void }) {
  // Persist light/dark mode in localStorage (placeholder logic)
  const [darkMode, setDarkMode] = React.useState(() =>
    typeof window !== "undefined" && window.localStorage.getItem("tmode") === "dark"
      ? true
      : false
  );
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("tmode", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Menu item config
  const items = [
    { icon: <User />, label: "Profile" },
    { icon: <File />, label: "Docs" },
    { icon: <Settings />, label: "Settings" },
    { icon: <BookOpen />, label: "Learn" },
    { icon: <LifeBuoy />, label: "Support" },
  ];

  return (
    <aside
      className="fixed right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-[#20232a] shadow-xl z-50 flex flex-col transition-all duration-300 ease-in-out animate-slide-in 
      "
      style={{ boxShadow: "0 0 32px #3333" }}
      tabIndex={0}
    >
      {/* Close Button (top-right) */}
      <button
        className="absolute top-3 right-5 rounded-full p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
        aria-label="Close menu"
        onClick={onClose}
        type="button"
      >
        <ArrowRight className="w-5 h-5" />
      </button>
      {/* Menu items */}
      <div className="flex-1 flex flex-col gap-1 pt-14 pb-6">
        {items.map(({ icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-4 text-lg font-medium py-4 px-6 transition rounded-lg hover:bg-[#f4f6fa] dark:hover:bg-[#222e] text-[#333] dark:text-white/90"
            type="button"
          >
            {React.cloneElement(icon, { className: "w-6 h-6" })} {label}
          </button>
        ))}
      </div>
      {/* Dark/Light Mode Toggle */}
      <div className="border-t border-gray-200 dark:border-[#333] py-4 px-6 flex items-center justify-between">
        <span className="flex items-center gap-2 text-base font-medium">
          {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          {darkMode ? "Dark" : "Light"} mode
        </span>
        <button
          className="ml-2 py-1 px-3 rounded-full bg-[#ececec] dark:bg-[#232a38] text-sm font-semibold transition"
          type="button"
          onClick={() => setDarkMode((d) => !d)}
        >
          {darkMode ? "Light" : "Dark"}
        </button>
      </div>
    </aside>
  );
}
