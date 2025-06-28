
import * as React from "react";
import {
  User,
  FileText,
  Settings,
  BookOpen,
  LifeBuoy,
  Sun,
  Moon,
  X
} from "lucide-react";
import { SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function HamburgerMenu({ onClose }: { onClose: () => void }) {
  const [darkMode, setDarkMode] = React.useState(() =>
    typeof window !== "undefined" && window.localStorage.getItem("tmode") === "dark"
      ? true
      : false
  );
  const { toast } = useToast();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("tmode", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to log out. Please try again.",
          variant: "destructive",
        });
        console.error("Logout error:", error);
      } else {
        toast({
          title: "Success",
          description: "You have been logged out successfully.",
        });
        // Close the menu
        onClose();
        // Navigate to auth page
        navigate('/auth');
      }
    } catch (error) {
      console.error("Unexpected logout error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  const accountItems = [
    { icon: <User />, label: "Profile" },
    { icon: <FileText />, label: "Docs" },
  ];

  const supportItems = [
    { icon: <LifeBuoy />, label: "Support" },
    { icon: <Settings />, label: "Settings" },
    { icon: <BookOpen />, label: "Learn" },
  ];

  return (
    <SheetContent 
      side="right" 
      className="w-80 bg-white/90 backdrop-blur-md border-l border-white/20 shadow-lg z-[150] dark:bg-[#20232a]/90"
    >
      <div className="flex flex-col h-full">
        {/* Menu Content */}
        <div className="flex-1 flex flex-col pt-12 pb-6 px-4 space-y-6">
          {/* Account Section */}
          <div>
            <h2 className="text-sm text-muted-foreground uppercase mb-3 font-semibold tracking-wide">Account</h2>
            <div className="space-y-1">
              {accountItems.map(({ icon, label }) => (
                <button
                  key={label}
                  className="flex items-center gap-4 w-full text-lg font-medium py-3 px-3 transition-all duration-150 ease-in-out rounded-lg hover:bg-[#f4f6fa] dark:hover:bg-[#2a2e37] text-[#333] dark:text-white/90"
                  type="button"
                >
                  {React.cloneElement(icon, { className: "w-6 h-6" })} 
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Support Section */}
          <div>
            <h2 className="text-sm text-muted-foreground uppercase mb-3 font-semibold tracking-wide">Support</h2>
            <div className="space-y-1">
              {supportItems.map(({ icon, label }) => (
                <button
                  key={label}
                  className="flex items-center gap-4 w-full text-lg font-medium py-3 px-3 transition-all duration-150 ease-in-out rounded-lg hover:bg-[#f4f6fa] dark:hover:bg-[#2a2e37] text-[#333] dark:text-white/90"
                  type="button"
                >
                  {React.cloneElement(icon, { className: "w-6 h-6" })} 
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Dark/Light Mode Toggle */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span className="text-base font-medium">
                {darkMode ? "Dark" : "Light"} mode
              </span>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className="ml-2"
            />
          </div>

          {/* Logout Section */}
          <div className="mt-6 border-t border-border pt-4">
            <button 
              onClick={handleLogout} 
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-150 ease-in-out"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </SheetContent>
  );
}
