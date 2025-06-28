import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password: string) {
  // Basic password validation: at least 6 chars
  return password.length >= 6;
}
export function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();

  // Validation errors
  const emailError = touched.email && !email ? "Please enter your email" : touched.email && !validateEmail(email) ? "Please enter a valid email address" : "";
  const passwordError = touched.password && !password ? "Please enter your password" : touched.password && !validatePassword(password) ? "Password must be at least 6 characters" : "";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      email: true,
      password: true
    });

    // Validate before submit
    if (!email || !validateEmail(email) || !password || !validatePassword(password)) {
      return;
    }
    setLoading(true);

    // Sign in flow
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if (!error) {
      toast({
        title: "Signed In!",
        description: "Successfully signed in."
      });
      // Explicitly navigate to home page after successful login
      navigate('/');
    } else {
      toast({
        title: "Login failed",
        description: error.message === "Invalid login credentials" ? "Invalid email or password." : error.message || "There was a problem signing in.",
        variant: "destructive"
      });
    }
  };
  return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#eaeaea] via-white to-[#eaeaea] px-4 relative">
      <div aria-hidden="true" className="absolute inset-0 backdrop-blur-sm bg-[#338dda]"></div>
      <div className="relative w-full max-w-sm mx-auto flex flex-col items-center z-10 px-4 py-8 rounded-xl shadow-lg bg-white/80">
        <img src="/lovable-uploads/e9f7f372-2dd2-45bb-aefd-a4504a9f0249.png" alt="The Tradesmen AI Logo" draggable={false} className="mb-6 object-contain drop-shadow w-64 h-64" />
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit} aria-labelledby="login-title">
          <div id="login-title" className="text-center font-semibold text-[#333333] text-lg mb-2">
            Log in to your AI Assistant
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="email" className="text-[#333333] text-sm">Email</Label>
            <Input id="email" type="email" name="email" autoComplete="email" required autoFocus disabled={loading} value={email} aria-required="true" aria-invalid={!!emailError} aria-describedby={emailError ? "email-error" : undefined} placeholder="you@example.com" className="text-base px-4 py-3 bg-white border border-[#eaeaea] focus-visible:ring-2 focus-visible:ring-[#3b9fe6]" onBlur={() => setTouched(t => ({
            ...t,
            email: true
          }))} onChange={e => {
            setEmail(e.target.value);
            setTouched(t => ({
              ...t,
              email: true
            }));
          }} />
            {emailError && <span className="text-xs text-red-500 mt-1" id="email-error">{emailError}</span>}
          </div>
          <div className="flex flex-col gap-1 relative">
            <Label htmlFor="password" className="text-[#333333] text-sm">
              Password
              <span className="ml-1 text-xs text-gray-400">(min 6 chars)</span>
            </Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" required disabled={loading} value={password} aria-required="true" aria-invalid={!!passwordError} aria-describedby={passwordError ? "password-error" : undefined} onBlur={() => setTouched(t => ({
              ...t,
              password: true
            }))} onChange={e => {
              setPassword(e.target.value);
              setTouched(t => ({
                ...t,
                password: true
              }));
            }} placeholder="Enter your password" className="text-base px-4 py-3 bg-white border border-[#eaeaea] focus-visible:ring-2 focus-visible:ring-[#3b9fe6] pr-12" />
              <button type="button" tabIndex={-1} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? "Hide password" : "Show password"} disabled={loading}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && <span className="text-xs text-red-500 mt-1" id="password-error">{passwordError}</span>}
          </div>
          <Button type="submit" className="mt-2 w-full font-bold text-base shadow active:scale-[0.98] transition-transform bg-[#3b9fe6] hover:bg-[#2176bd] focus-visible:ring-[#3b9fe6]" disabled={loading || !!emailError || !!passwordError} aria-busy={loading}>
            {loading ? <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" /> Signing in...
              </span> : "Sign In"}
          </Button>
        </form>
        <div className="mt-3 text-center text-sm text-[#3b9fe6] font-medium">
          Don't have an account yet?
          <button className="ml-2 text-xs text-[#3b9fe6] underline hover:text-[#2176bd] transition-colors" type="button" onClick={() => window.open("https://www.thetradesmen.ai", "_blank")} disabled={loading}>
            Sign Up
          </button>
        </div>
        <div className="mt-4 text-center">
          <button type="button" className="text-xs text-[#3b9fe6] underline hover:text-[#2176bd] transition-colors" onClick={() => window.open("mailto:support@thetradesmen.ai?subject=theTradesmen.ai Login Help", "_blank")} tabIndex={0}>
            Need help logging in? Contact support
          </button>
        </div>
      </div>
    </div>;
}
