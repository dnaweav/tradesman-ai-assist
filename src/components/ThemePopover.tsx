
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sun, Moon } from "lucide-react";

export function ThemePopover() {
  const [mode, setMode] = React.useState<"light" | "dark">(() =>
    typeof window !== "undefined" && window.localStorage.getItem("tmode") === "dark" ? "dark" : "light"
  );

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    window.localStorage.setItem("tmode", mode);
  }, [mode]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="rounded-full px-3 py-2 bg-white border border-[#eaeaea] shadow flex items-center gap-2 font-medium transition hover:bg-[#3b9fe6] hover:text-white"
          aria-label="Toggle theme"
        >
          {mode === "dark" ? <Moon /> : <Sun />} <span>{mode === "dark" ? "Dark" : "Light"}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex gap-2 items-center justify-center px-2 py-1">
          <button
            className={`p-2 rounded-lg ${mode === "light" ? "bg-[#3b9fe6] text-white" : ""}`}
            onClick={() => setMode("light")}
          >
            <Sun size={20} />
          </button>
          <button
            className={`p-2 rounded-lg ${mode === "dark" ? "bg-[#333333] text-white" : ""}`}
            onClick={() => setMode("dark")}
          >
            <Moon size={20} />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
