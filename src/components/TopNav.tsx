
import * as React from "react";
import { Sun, Moon, Menu, ArrowLeft } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AVATAR_SRC = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=96&h=96&fit=facearea&facepad=2&q=80";

interface TopNavProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export function TopNav({ showBackButton = false, onBackClick }: TopNavProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = React.useState<string | null>(null);
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
  
  return (
    <header className="fixed top-0 left-0 right-0 z-30 w-full flex items-center justify-between py-3 px-4 backdrop-blur-md border-b border-gray-200 shadow-sm bg-[#3878eb]/[0.89]">
      {/* Left side - Back button or empty space */}
      <div className="flex-1 flex items-center">
        {showBackButton && onBackClick && (
          <button
            onClick={onBackClick}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
        )}
      </div>
      
      {/* Avatar and Hamburger (right-aligned, but swapped order) */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Avatar (now left of hamburger) */}
        <button
          onClick={handleAvatarClick}
          className="transition-transform active:scale-95"
          aria-label="Go to user profile"
        >
          <img 
            src={profilePhotoUrl || AVATAR_SRC} 
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shadow-sm hover:border-white/50 transition-colors" 
            alt="User avatar" 
          />
        </button>
        
        {/* Hamburger (now right of avatar) */}
        <button aria-label="Open menu" onClick={() => setMenuOpen(true)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors active:scale-95" type="button" style={{
        zIndex: 2
      }}>
          <Menu className="text-gray-700" size={22} />
        </button>
      </div>
      
      {/* Hamburger Slide-in Drawer */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <HamburgerMenu onClose={() => setMenuOpen(false)} />
      </Sheet>
    </header>
  );
}
