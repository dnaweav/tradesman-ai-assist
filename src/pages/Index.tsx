
import * as React from "react";
import { PromptPills } from "@/components/PromptPills";
import { AppBottomTabs } from "@/components/AppBottomTabs";
import { Sheet } from "@/components/ui/sheet";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { InputBar } from "@/components/InputBar";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Menu, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

const AVATAR_SRC = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=96&h=96&fit=facearea&facepad=2&q=80";

export default function Index() {
  const [input, setInput] = React.useState("");
  const [micActive, setMicActive] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("home");
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [footerHeight, setFooterHeight] = React.useState(140);
  const [profilePhotoUrl, setProfilePhotoUrl] = React.useState<string | null>(null);
  const isKeyboardVisible = useKeyboardVisible();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load user's profile photo
  React.useEffect(() => {
    if (user) {
      loadUserProfilePhoto();
    }
  }, [user]);

  const loadUserProfilePhoto = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('profile_photo_url')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading user profile photo:', error);
        return;
      }

      if (data?.profile_photo_url) {
        setProfilePhotoUrl(data.profile_photo_url);
      }
    } catch (error) {
      console.error('Error loading user profile photo:', error);
    }
  };

  const handleAvatarClick = () => {
    navigate('/user-profile');
  };

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
    <div className="min-h-screen w-full bg-gradient-to-b from-[#3b9fe6] to-[#2a8dd9] flex flex-col overflow-hidden relative">
      {/* Fixed Header */}
      <header className="fixed top-0 w-full px-4 py-3 flex justify-between items-center bg-blue-500/80 backdrop-blur z-50">
        <button
          onClick={handleAvatarClick}
          className="transition-transform active:scale-95"
          aria-label="Go to user profile"
        >
          <img 
            src={profilePhotoUrl || AVATAR_SRC} 
            className="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow hover:border-white/50 transition-colors" 
            alt="User avatar" 
          />
        </button>
        
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

      {/* Main Content - Centered vertically with proper spacing */}
      <div 
        className="flex flex-col items-center justify-center flex-grow pt-16 px-4 transition-all duration-200 ease-in-out"
        style={{ paddingBottom: "20px" }}
      >
        <img 
          alt="theTradesmen.ai logo" 
          src="/lovable-uploads/1469542c-df73-456d-a0b0-baa6fdac06ca.png" 
          className="w-48 h-48 mx-auto mb-6 object-scale-down" 
        />
        
        <h1 className="text-2xl md:text-3xl font-semibold text-white text-center mb-8 animate-fade-in">
          What can I help with?
        </h1>

        <PromptPills onPrompt={handlePrompt} />
      </div>

      {/* Microphone Button - Hidden when keyboard is visible */}
      <div
        className={cn(
          "absolute left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300 ease-in-out",
          isKeyboardVisible ? "opacity-0 pointer-events-none scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"
        )}
        style={{ bottom: "50px" }}
      >
        <button 
          className="w-12 h-12 rounded-full border-3 border-white bg-[#ffc000] shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-150"
          style={{ boxShadow: "0 8px 32px #ffc00040" }}
          aria-label="Voice input" 
          onClick={handleMic} 
          type="button"
        >
          <Mic className="w-5 h-5 text-black" strokeWidth={2} />
        </button>
      </div>

      {/* Footer Container - Sticky positioning with input and nav */}
      <div className="sticky bottom-0 z-50 w-full backdrop-blur-md shadow-lg">
        {/* Input Bar */}
        <InputBar 
          value={input} 
          onChange={setInput}
          onSend={handleSend}
          onHeightChange={setFooterHeight}
          onMicClick={handleMic}
        />

        {/* Bottom Navigation - Hidden when keyboard is visible */}
        <AppBottomTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isKeyboardVisible={isKeyboardVisible}
        />
      </div>
    </div>
  );
}
