
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Update logo import to use the uploaded asset
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function validateEmail(email: string) {
  // Basic email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AuthScreen() {
  const [email, setEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const { toast } = useToast();

  const emailError = touched && !email
    ? "Please enter your email"
    : touched && !validateEmail(email)
      ? "Please enter a valid email address"
      : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!email || !validateEmail(email)) {
      return;
    }

    setLoading(true);
    setMagicSent(false);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: window.location.origin
      }
    });
    setLoading(false);

    if (!error) {
      setMagicSent(true);
      toast({
        title: "Magic link sent!",
        description: "Check your email for the login link.",
      });
    } else {
      toast({
        title: "Could not send magic link",
        description: error.message || "There was a problem sending the magic link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#eaeaea] via-white to-[#eaeaea] px-4 relative">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" aria-hidden="true"></div>
      <div className="relative w-full max-w-sm mx-auto flex flex-col items-center z-10 px-4 py-8 rounded-xl shadow-lg bg-white/80">
        <img
          src="/lovable-uploads/e9f7f372-2dd2-45bb-aefd-a4504a9f0249.png"
          alt="The Tradesmen AI Logo"
          className="mb-6 w-20 h-20 object-contain drop-shadow"
          draggable={false}
        />
        <div className="text-center mb-4 font-bold text-xl text-[#3b9fe6] tracking-tight">theTradesmen.ai</div>
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit}
          aria-labelledby="login-title"
        >
          <div id="login-title" className="text-center font-semibold text-[#333333] text-lg mb-2">
            Log in to your AI Assistant
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="email" className="text-[#333333] text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              aria-required="true"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
              required
              autoFocus
              value={email}
              disabled={magicSent || loading}
              onBlur={() => setTouched(true)}
              onChange={e => {
                setEmail(e.target.value);
                setTouched(true);
              }}
              placeholder="you@example.com"
              className="text-base px-4 py-3 bg-white border border-[#eaeaea] focus-visible:ring-2 focus-visible:ring-[#3b9fe6]"
            />
            {emailError && (
              <span className="text-xs text-red-500 mt-1" id="email-error">
                {emailError}
              </span>
            )}
          </div>
          <Button
            type="submit"
            className={`mt-2 w-full font-bold text-base shadow active:scale-[0.98] transition-transform bg-[#3b9fe6] hover:bg-[#2176bd] focus-visible:ring-[#3b9fe6]`}
            disabled={magicSent || loading || !!emailError}
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" /> Sending...
              </span>
            ) : magicSent
              ? "Check your email!"
              : "Send Magic Link"}
          </Button>
        </form>
        {magicSent && (
          <div className="mt-3 text-center text-sm text-[#3b9fe6] font-medium">
            Magic link sent<br />
            Please check your inbox.
          </div>
        )}
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-xs text-[#3b9fe6] underline hover:text-[#2176bd] transition-colors"
            onClick={() =>
              window.open("mailto:support@thetradesmen.ai?subject=theTradesmen.ai Login Help", "_blank")
            }
            tabIndex={0}
          >
            Need help logging in? Contact support
          </button>
        </div>
      </div>
    </div>
  );
}
