import * as React from "react";
import { AppBottomTabs } from "@/components/AppBottomTabs";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { TopNav } from "@/components/TopNav";
import { QuickActions } from "@/components/QuickActions";
import { ChatsList } from "@/components/TabContent/ChatsList";
import { ClientsList } from "@/components/TabContent/ClientsList";
import { DocsList } from "@/components/TabContent/DocsList";
import { ProfileDemo } from "@/components/TabContent/ProfileDemo";
import { SupportDemo } from "@/components/TabContent/SupportDemo";
import { Sheet } from "@/components/ui/sheet";
import { AuthScreen } from "@/components/Auth";
import { LoadingScreen } from "@/components/LoadingScreen";
import { WelcomeTour } from "@/components/WelcomeTour";
import { supabase } from "@/integrations/supabase/client";

// VoiceInputCard component: modern voice input UI
function VoiceInputCard({ onMic }: { onMic: () => void }) {
  const [isHover, setIsHover] = React.useState(false);

  return (
    <div className="relative bg-white/70 border border-[#eaeaea] rounded-2xl shadow-lg px-4 py-8 my-4 flex flex-col items-center justify-center text-center animate-fade-in backdrop-blur-xl max-w-xl mx-auto">
      <button
        aria-label="Tap to speak"
        className="outline-none border-none bg-transparent flex flex-col items-center justify-center"
        onClick={onMic}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <span className="relative w-16 h-16 mb-2 flex items-center justify-center">
          {/* Pulsing or bouncing mic */}
          <span className={`absolute inset-0 rounded-full bg-[#ffc000]/60 animate-mic-pulse scale-110`} />
          <span className={isHover ? "animate-mic-bounce" : ""}>
            <svg width={44} height={44} viewBox="0 0 48 48" fill="none">
              <circle cx={24} cy={24} r={20} fill="#ffc000" opacity="0.12" />
              <path d="M24 30c3 0 5-2 5-5V16c0-3-2-5-5-5s-5 2-5 5v9c0 3 2 5 5 5Z" stroke="#ffc000" strokeWidth="2.5" />
              <path d="M17 22v3a7 7 0 0 0 14 0v-3" stroke="#3b9fe6" strokeWidth="2" />
              <rect x={22} y={34} width={4} height={7} rx={2} fill="#3b9fe6" />
            </svg>
          </span>
        </span>
        <div className="text-lg font-semibold text-[#333333]">Tap to speak &mdash; we'll handle the admin</div>
        <button
          className="mt-3 text-sm text-[#3b9fe6] px-3 py-1 rounded transition hover:bg-[#3b9fe6]/10 font-medium"
          type="button"
          tabIndex={-1}
        >
          Or type it instead
        </button>
      </button>
    </div>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = React.useState("home");
  const [voiceSheetOpen, setVoiceSheetOpen] = React.useState(false);

  // --- Onboarding Flow State ---
  const [authChecked, setAuthChecked] = React.useState(false);
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [showTour, setShowTour] = React.useState(false);

  // Check Supabase session on mount
  React.useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthChecked(true);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecked(true);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Show welcome tour based on LS (first login after login)
  React.useEffect(() => {
    if (authChecked && session) {
      const hideTour = localStorage.getItem("hideWelcomeTour");
      setShowTour(hideTour !== "1");
    }
  }, [authChecked, session]);

  // Loading screen: fake loading on login or reload
  const [forceLoading, setForceLoading] = React.useState(false);
  React.useEffect(() => {
    if (authChecked && session) {
      setForceLoading(true);
      const t = setTimeout(() => setForceLoading(false), 1800);
      return () => clearTimeout(t);
    } else {
      setForceLoading(false);
    }
  }, [authChecked, session]);

  // Show login if not authenticated
  if (!authChecked) return <LoadingScreen />;
  if (!session) {
    return (
      <AuthScreen />
    );
  }
  if (forceLoading) return <LoadingScreen />;
  if (showTour) return <WelcomeTour onClose={() => setShowTour(false)} />;

  // Authenticated
  return (
    <div className="min-h-screen bg-[#eaeaea] dark:bg-[#20232a] text-[#333333] flex flex-col relative">
      <main className="flex-1 w-full max-w-md mx-auto flex flex-col relative pb-36 sm:max-w-full sm:pb-0 sm:px-3">
        <TopNav />
        <div className="flex-1 pt-1 px-1 pb-2 animate-fade-in">
          {(() => {
            switch (activeTab) {
              case "home":
                return (
                  <div className="space-y-8 pt-3">
                    <QuickActions onMic={() => setVoiceSheetOpen(true)} />
                    <VoiceInputCard onMic={() => setVoiceSheetOpen(true)} />
                  </div>
                );
              case "chats":
                return <ChatsList />;
              case "clients":
                return <ClientsList />;
              case "docs":
                return <DocsList />;
              case "profile":
                return <ProfileDemo />;
              case "support":
                return <SupportDemo />;
              default:
                return null;
            }
          })()}
        </div>
        {/* Floating mic button */}
        <VoiceInputButton onClick={() => setVoiceSheetOpen(true)} />
        {/* Voice input modal */}
        <Sheet open={voiceSheetOpen} onOpenChange={setVoiceSheetOpen}>
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
    </div>
  );
}
