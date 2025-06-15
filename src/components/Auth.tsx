
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password: string) {
  // Basic password validation: at least 6 chars
  return password.length >= 6;
}

export function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false, confirm: false });
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  // Validation errors
  const emailError =
    touched.email && !email
      ? "Please enter your email"
      : touched.email && !validateEmail(email)
      ? "Please enter a valid email address"
      : "";

  const passwordError =
    touched.password && !password
      ? "Please enter your password"
      : touched.password && !validatePassword(password)
      ? "Password must be at least 6 characters"
      : "";

  const confirmPasswordError =
    isSignUp && touched.confirm && confirmPassword !== password
      ? "Passwords do not match"
      : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true, confirm: true });

    // Validate before submit
    if (
      !email ||
      !validateEmail(email) ||
      !password ||
      !validatePassword(password) ||
      (isSignUp && confirmPassword !== password)
    ) {
      return;
    }

    setLoading(true);

    if (isSignUp) {
      // Sign up flow
      const {
        error,
        data,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      setLoading(false);
      if (!error) {
        toast({
          title: "Account created!",
          description: "Check your email to confirm your account."
        });
      } else {
        toast({
          title: "Sign up failed",
          description: error.message || "There was an issue creating your account.",
          variant: "destructive"
        });
      }
    } else {
      // Sign in flow
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (!error) {
        toast({
          title: "Signed In!",
          description: "Successfully signed in."
        });
      } else {
        toast({
          title: "Login failed",
          description:
            error.message === "Invalid login credentials"
              ? "Invalid email or password."
              : error.message || "There was a problem signing in.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#eaeaea] via-white to-[#eaeaea] px-4 relative">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" aria-hidden="true"></div>
      <div className="relative w-full max-w-sm mx-auto flex flex-col items-center z-10 px-4 py-8 rounded-xl shadow-lg bg-white/80">
        <img
          src="/lovable-uploads/e9f7f372-2dd2-45bb-aefd-a4504a9f0249.png"
          alt="The Tradesmen AI Logo"
          draggable={false}
          className="mb-6 object-contain drop-shadow"
        />
        <div className="text-center mb-4 font-bold text-xl text-[#3b9fe6] tracking-tight">theTradesmen.ai</div>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit} aria-labelledby="login-title">
          <div id="login-title" className="text-center font-semibold text-[#333333] text-lg mb-2">
            {isSignUp ? "Create your account" : "Log in to your AI Assistant"}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="email" className="text-[#333333] text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              required
              autoFocus
              disabled={loading}
              value={email}
              aria-required="true"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
              placeholder="you@example.com"
              className="text-base px-4 py-3 bg-white border border-[#eaeaea] focus-visible:ring-2 focus-visible:ring-[#3b9fe6]"
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              onChange={e => { setEmail(e.target.value); setTouched((t) => ({ ...t, email: true })); }}
            />
            {emailError && <span className="text-xs text-red-500 mt-1" id="email-error">{emailError}</span>}
          </div>
          <div className="flex flex-col gap-1 relative">
            <Label htmlFor="password" className="text-[#333333] text-sm">
              Password
              <span className="ml-1 text-xs text-gray-400">(min 6 chars)</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
                disabled={loading}
                value={password}
                aria-required="true"
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? "password-error" : undefined}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                onChange={e => { setPassword(e.target.value); setTouched((t) => ({ ...t, password: true })); }}
                placeholder="Enter your password"
                className="text-base px-4 py-3 bg-white border border-[#eaeaea] focus-visible:ring-2 focus-visible:ring-[#3b9fe6] pr-12"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && <span className="text-xs text-red-500 mt-1" id="password-error">{passwordError}</span>}
          </div>
          {isSignUp && (
            <div className="flex flex-col gap-1">
              <Label htmlFor="confirm-password" className="text-[#333333] text-sm">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                name="confirm-password"
                autoComplete="new-password"
                required
                disabled={loading}
                value={confirmPassword}
                aria-required="true"
                aria-invalid={!!confirmPasswordError}
                aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
                onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                onChange={e => { setConfirmPassword(e.target.value); setTouched((t) => ({ ...t, confirm: true })); }}
                placeholder="Re-enter your password"
                className="text-base px-4 py-3 bg-white border border-[#eaeaea] focus-visible:ring-2 focus-visible:ring-[#3b9fe6]"
              />
              {confirmPasswordError && (
                <span className="text-xs text-red-500 mt-1" id="confirm-password-error">{confirmPasswordError}</span>
              )}
            </div>
          )}
          <Button
            type="submit"
            className="mt-2 w-full font-bold text-base shadow active:scale-[0.98] transition-transform bg-[#3b9fe6] hover:bg-[#2176bd] focus-visible:ring-[#3b9fe6]"
            disabled={loading || !!emailError || !!passwordError || (isSignUp && !!confirmPasswordError)}
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" /> {isSignUp ? "Signing up..." : "Signing in..."}
              </span>
            ) : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>
        <div className="mt-3 text-center text-sm text-[#3b9fe6] font-medium">
          {isSignUp
            ? "Already have an account?"
            : "Don't have an account yet?"}
          <button
            className="ml-2 text-xs text-[#3b9fe6] underline hover:text-[#2176bd] transition-colors"
            type="button"
            onClick={() => {
              setIsSignUp((s) => !s);
              setTouched({ email: false, password: false, confirm: false });
              setPassword("");
              setConfirmPassword("");
            }}
            disabled={loading}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-xs text-[#3b9fe6] underline hover:text-[#2176bd] transition-colors"
            onClick={() =>
              window.open(
                "mailto:support@thetradesmen.ai?subject=theTradesmen.ai Login Help",
                "_blank"
              )
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
