
import * as React from "react";
import { InputBar } from "@/components/InputBar";
import { PromptPills } from "@/components/PromptPills";
import { AppBottomTabs } from "@/components/AppBottomTabs";

export default function Index() {
  const [input, setInput] = React.useState("");
  const [micActive, setMicActive] = React.useState(false);
  // Tab state: 'home', 'chats', or 'clients'
  const [activeTab, setActiveTab] = React.useState("home");

  // Animate the mic button for feedback
  function handleMic() {
    setMicActive(true);
    setTimeout(() => setMicActive(false), 480);
    // TODO: trigger voice modal
  }

  // Allow quick prompt fill
  function handlePrompt(p: string) {
    setInput(p);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#3b9fe6] relative overflow-x-clip py-8 px-4">
      {/* Centered Heading */}
      <h1 className="text-2xl md:text-3xl font-semibold text-white text-center mb-6 animate-fade-in">
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
      <div className="w-full flex flex-col items-center">
        <PromptPills onPrompt={handlePrompt} />
      </div>

      {/* Pad to avoid bottom nav overlap (esp. on mobile) */}
      <div className="pb-32" />

      {/* Bottom Navigation Tab Bar */}
      <AppBottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
