
import * as React from "react";
import { PromptPills } from "@/components/PromptPills";
import { AppBottomTabs } from "@/components/AppBottomTabs";
import { Sheet } from "@/components/ui/sheet";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { Menu, Mic } from "lucide-react";

const AVATAR_SRC =
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=96&h=96&fit=facearea&facepad=2&q=80";

export default function Index() {
  const [input, setInput] = React.useState("");
  const [micActive, setMicActive] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("home");
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
    <div className="min-h-screen bg-[#3b9fe6] flex flex-col relative overflow-x-clip">
      {/* Fixed Header */}
      <header className="fixed top-0 w-full px-4 py-3 flex justify-between items-center bg-blue-500/80 backdrop-blur z-50">
        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 active:scale-95 transition-all duration-150 ease-in-out focus-visible:outline-none"
          type="button"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
        <img
          src={AVATAR_SRC}
          className="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow"
          alt="User avatar"
        />
      </header>

      {/* Hamburger Menu Sheet */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <HamburgerMenu onClose={() => setMenuOpen(false)} />
      </Sheet>

      {/* Main Content - Centered prompt area */}
      <div className="flex flex-col items-center justify-center flex-grow pt-[64px] pb-[160px] px-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-white text-center mb-6 animate-fade-in">
          What can I help with?
        </h1>
        
        <div className="relative max-w-xl w-full mb-4">
          <input
            className="w-full px-6 py-3 rounded-full bg-white/10 backdrop-blur text-white placeholder-white/50 text-base border border-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            placeholder="Describe the job, follow-up or task…"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        <PromptPills onPrompt={handlePrompt} />
      </div>

      {/* Floating Mic Button */}
      <button
        className="fixed bottom-[72px] left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full border-4 border-white bg-[#ffc000] shadow-xl flex items-center justify-center z-40 hover:scale-105 transition-all duration-150 ease-in-out active:scale-95"
        style={{
          boxShadow: "0 8px 32px #ffc00040"
        }}
        aria-label="Voice input"
        onClick={handleMic}
        type="button"
      >
        <Mic className="w-6 h-6 text-black" strokeWidth={2} />
      </button>

      {/* Bottom Navigation */}
      <AppBottomTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
