
import * as React from "react";
import { AppBottomTabs } from "@/components/AppBottomTabs";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { TopNav } from "@/components/TopNav";
import { Auth } from "@/components/Auth";
import { QuickActions } from "@/components/QuickActions";
import { ChatsList } from "@/components/TabContent/ChatsList";
import { ClientsList } from "@/components/TabContent/ClientsList";
import { DocsList } from "@/components/TabContent/DocsList";
import { ProfileDemo } from "@/components/TabContent/ProfileDemo";
import { SupportDemo } from "@/components/TabContent/SupportDemo";
import { Sheet } from "@/components/ui/sheet";

const TABS = [
  { key: "home", label: "Home" },
  { key: "chats", label: "Chats" },
  { key: "clients", label: "Clients" },
  { key: "docs", label: "Docs" },
  { key: "profile", label: "Profile" },
  { key: "support", label: "Support" },
];

export default function Index() {
  const [activeTab, setActiveTab] = React.useState("home");
  const [voiceSheetOpen, setVoiceSheetOpen] = React.useState(false);

  // Supabase session/context managed by Auth
  return (
    <div className="min-h-screen bg-[#eaeaea] text-[#333333] flex flex-col relative">
      <Auth>
        <main className="flex-1 w-full max-w-md mx-auto flex flex-col relative pb-24 sm:max-w-full sm:pb-0 sm:px-10">
          <TopNav />
          <div className="flex-1 mt-1">
            {
              {
                home: (
                  <div className="space-y-6 pt-4">
                    <QuickActions onMic={() => setVoiceSheetOpen(true)} />
                  </div>
                ),
                chats: <ChatsList />,
                clients: <ClientsList />,
                docs: <DocsList />,
                profile: <ProfileDemo />,
                support: <SupportDemo />,
              }[activeTab]
            }
          </div>
          {/* Floating voice input button for all tabs */}
          <VoiceInputButton onClick={() => setVoiceSheetOpen(true)} />
          <Sheet open={voiceSheetOpen} onOpenChange={setVoiceSheetOpen}>
            {/* Demo voice input modal */}
            <div className="p-6 text-center" style={{ minWidth: 320 }}>
              <div className="text-xl font-semibold mb-2">Speak your note</div>
              <div className="text-[#3b9fe6] font-bold mb-6 text-4xl">
                🎤
              </div>
              <div className="text-gray-500 mb-4">
                (Voice input coming soon! Tap the mic, and we’ll turn your words into instant quotes, emails, or invoices.)
              </div>
              <button
                onClick={() => setVoiceSheetOpen(false)}
                className="mt-6 rounded-lg bg-[#3b9fe6] text-white font-medium px-5 py-2 shadow hover:bg-blue-600 transition"
              >
                Close
              </button>
            </div>
          </Sheet>
        </main>
        <AppBottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </Auth>
    </div>
  );
}
