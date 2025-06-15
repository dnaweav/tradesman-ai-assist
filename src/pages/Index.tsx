
import * as React from "react";
import { InputBar } from "@/components/InputBar";
import { PromptPills } from "@/components/PromptPills";

export default function Index() {
  const [input, setInput] = React.useState("");
  const [micActive, setMicActive] = React.useState(false);

  // Mock mic interaction feedback: scale/glow on tap
  function handleMic() {
    setMicActive(true);
    setTimeout(() => setMicActive(false), 480);
    // TODO: trigger voice modal/assistant logic here
  }

  // Optional: handle prompt tap to fill input
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

      {/* Spacing */}
      <div className="pb-12" />
    </div>
  );
}
