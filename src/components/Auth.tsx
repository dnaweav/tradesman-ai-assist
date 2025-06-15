
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import TheTradesmenLogo from "/TheTradesmen_Logo_Blue_1.png";

type AuthScreenProps = {
  onLoginStart?: () => void,
  onLoginSuccess?: () => void
};

export function AuthScreen({ onLoginStart, onLoginSuccess }: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMagicSent(false);

    if (!email) return;

    setLoading(true);
    onLoginStart?.();
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
      onLoginSuccess?.();
    } else {
      setError(error.message || "There was a problem sending the magic link.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-[#eaeaea] to-white px-4 relative">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md"></div>
      <div className="relative w-full max-w-xs z-10">
        <img
          src={TheTradesmenLogo}
          alt="The Tradesmen AI Logo"
          className="block mx-auto mb-6 w-20 h-20 object-contain"
        />
        <div className="text-center mb-3 font-bold text-xl text-[#3b9fe6]">theTradesmen.ai</div>
        <form
          className="bg-white rounded-2xl shadow-lg p-7 mt-2 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div className="text-center font-semibold text-[#333333] text-lg mb-1">
            Log in to your AI Assistant
          </div>
          <Input
            type="email"
            required
            autoFocus
            value={email}
            disabled={magicSent || loading}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="text-base px-4 py-3"
          />
          <Button
            type="submit"
            className="mt-1 w-full bg-[#3b9fe6] text-white font-bold text-base shadow active:scale-95 transition-transform"
            disabled={magicSent || loading || !email}
          >
            {loading ? "Sending..." : magicSent ? "Check your email!" : "Send Magic Link"}
          </Button>
          {error && (
            <div className="text-xs text-red-600 text-center">{error}</div>
          )}
          <div className="mt-1 text-xs text-gray-400 text-center">
            Demo login – real email required; stay signed in between sessions.
          </div>
        </form>
        <div className="mt-5 text-sm text-gray-500 text-center">
          Having trouble? <a href="mailto:support@thetradesmen.ai" className="text-[#3b9fe6] underline">Contact support</a>
        </div>
      </div>
    </div>
  );
}
