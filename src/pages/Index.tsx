
import * as React from "react";
import { PromptPills } from "@/components/PromptPills";
import { AppBottomTabs } from "@/components/AppBottomTabs";
import { Sheet } from "@/components/ui/sheet";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { InputBar } from "@/components/InputBar";
import { Menu, Mic } from "lucide-react";

const AVATAR_SRC = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=96&h=96&fit=facearea&facepad=2&q=80";

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

  function handleSend(message: string, files: File[]) {
    console.log('Sending message:', message);
    console.log('With files:', files);
    // TODO: Implement message sending logic
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#3b9fe6] to-[#2a8dd9] flex flex-col relative overflow-x-clip">
      {/* Fixed Header */}
      <header className="fixed top-0 w-full px-4 py-3 flex justify-between items-center bg-blue-500/80 backdrop-blur z-50">
        {/* Avatar on Left */}
        <img 
          src={AVATAR_SRC} 
          className="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow" 
          alt="User avatar" 
        />
        
        {/* Hamburger Menu on Right */}
        <button 
          aria-label="Open menu" 
          onClick={() => setMenuOpen(true)} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 active:scale-95 transition-all duration-150 ease-in-out focus-visible:outline-none" 
          type="button"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </header>

      {/* Hamburger Menu Sheet */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <HamburgerMenu onClose={() => setMenuOpen(false)} />
      </Sheet>

      {/* Main Content - Centered prompt area */}
      <div className="flex flex-col items-center justify-center flex-grow pt-[64px] pb-[240px] px-4">
        {/* Brand Logo */}
        <img 
          alt="theTradesmen.ai logo" 
          src="/lovable-uploads/1469542c-df73-456d-a0b0-baa6fdac06ca.png" 
          className="w-64 h-64 mx-auto mb-4 object-scale-down" 
        />
        
        <h1 className="text-2xl md:text-3xl font-semibold text-white text-center mb-6 animate-fade-in">
          What can I help with?
        </h1>

        {/* Prompt Pills with dynamic spacing */}
        <div className="mb-8">
          <PromptPills onPrompt={handlePrompt} />
        </div>
      </div>

      {/* Input Bar - Fixed at bottom with proper spacing */}
      <div className="fixed bottom-[140px] left-0 right-0 z-30">
        <InputBar 
          value={input} 
          onChange={setInput}
          onSend={handleSend}
        />
      </div>

      {/* Floating Mic Button */}
      <button 
        className="fixed bottom-[86px] left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full border-4 border-white bg-[#ffc000] shadow-xl flex items-center justify-center z-40 hover:scale-105 transition-all duration-150 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300" 
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
      <AppBottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
