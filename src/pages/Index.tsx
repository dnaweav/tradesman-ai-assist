
import * as React from "react";
import { InputBar } from "@/components/InputBar";
import { PromptPills } from "@/components/PromptPills";
import { AppBottomTabs } from "@/components/AppBottomTabs";
import { Sheet } from "@/components/ui/sheet";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { Menu } from "lucide-react";

const AVATAR_SRC =
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=96&h=96&fit=facearea&facepad=2&q=80";

export default function Index() {
  const [input, setInput] = React.useState("");
  const [micActive, setMicActive] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("home");

  // Hamburger menu state for Sheet
  const [menuOpen, setMenuOpen] = React.useState(false);

  function handleMic() {
    setMicActive(true);
    setTimeout(() => setMicActive(false), 480);
    // TODO: Trigger voice modal
  }

  function handlePrompt(p: string) {
    setInput(p);
  }

  return (
    <div className="min-h-screen bg-[#3b9fe6] flex flex-col justify-center items-center relative overflow-x-clip">
      {/* ----- HEADER: Hamburger + Avatar, fixed on top ----- */}
      <header className="fixed top-0 left-0 w-full z-50 px-4 py-3 flex justify-between items-center bg-blue-500/80 backdrop-blur transition">
        {/* Hamburger icon (opens Sheet) */}
        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 active:scale-95 transition focus-visible:outline-none"
          type="button"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
        {/* Avatar on the right */}
        <img
          src={AVATAR_SRC}
          className="w-11 h-11 rounded-full object-cover border-2 border-white/30 shadow"
          alt="User avatar"
        />
        {/* Side Sheet (HamburgerMenu) */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <HamburgerMenu onClose={() => setMenuOpen(false)} />
        </Sheet>
      </header>

      {/* ----- Main Content: Center elements with top padding for header and bottom for nav ----- */}
      <main className="flex flex-col items-center justify-center flex-1 gap-6 px-4 pt-24 pb-40 w-full">
        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-semibold text-white text-center mb-3 animate-fade-in">
          What can I help with?
        </h1>
        {/* Input Bar */}
        <div className="w-full flex flex-col items-center">
          <InputBar
            value={input}
            onChange={setInput}
            onMic={handleMic}
            micActive={micActive}
          />
        </div>
        {/* Prompt Pills */}
        <PromptPills onPrompt={handlePrompt} />
      </main>

      {/* ----- Floating Mic Button: positioned above nav, centered ----- */}
      <button
        className="absolute bottom-[84px] left-1/2 -translate-x-1/2 z-40 bg-[#ffc000] text-[#222] w-14 h-14 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform animate-pulse-glow"
        style={{
          boxShadow: "0 8px 32px #ffc00040"
        }}
        aria-label="Voice input"
        tabIndex={0}
        onClick={handleMic}
        type="button"
      >
        <span className="sr-only">Start voice input</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.7}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19v2m4-2v-2a4 4 0 00-8 0v2m8 0a4 4 0 01-8 0m8 0v-7a4 4 0 00-8 0v7"></path>
          <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
        </svg>
      </button>

      {/* ----- Floating Bottom Nav Bar ----- */}
      <AppBottomTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        // onMicClick={handleMic} // The FAB is separated above, not docked in nav
      />
    </div>
  );
}
