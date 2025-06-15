
import * as React from "react";
import { TopNav } from "@/components/TopNav";
import { AppBottomTabs } from "@/components/AppBottomTabs";
import { HeroSection } from "@/components/HeroSection";

export default function Index() {
  // Active tab always home here for simplicity
  const [activeTab, setActiveTab] = React.useState("home");

  return (
    <div className="min-h-screen flex flex-col bg-[#3b9fe6] relative overflow-x-hidden">
      <TopNav />
      {/* Optional background illustration for subtle depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"
        style={{ zIndex: 1 }}
      ></div>
      {/* Hero section (centered) */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 relative z-10">
        <HeroSection />
      </main>
      {/* Bottom Navigation */}
      <AppBottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
