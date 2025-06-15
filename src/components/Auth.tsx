
import React, { useEffect, useState } from "react";
import { createClient, User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

// -- NOTE: Use your Supabase project URL and PUBLIC anon key here for demo only (for prod, set up env/secrets!) --
const SUPABASE_URL = "https://demo.supabase.co"; // TODO: Replace with your Supabase URL
const SUPABASE_ANON_KEY = "your-anon-key"; // TODO: Replace with your Supabase anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const Auth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [fetching, setFetching] = useState(true);
  const [email, setEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setFetching(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (fetching) return <div className="flex items-center justify-center min-h-screen">Loading…</div>;

  if (!session)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eaeaea] px-4">
        <form
          className="w-full max-w-xs bg-white p-8 rounded-xl shadow-xl border mx-auto"
          onSubmit={async (e) => {
            e.preventDefault();
            setMagicSent(false);
            if (email) {
              const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
              if (!error) setMagicSent(true);
            }
          }}
        >
          <div className="text-center mb-6">
            <span className="inline-block rounded-full bg-[#3b9fe6] px-3 py-2 font-bold text-white text-xl mb-2 shadow">
              theTradesmen.ai
            </span>
          </div>
          <div className="mb-3">
            <label className="block font-semibold text-sm mb-1 text-[#3b9fe6]">Email</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-lg outline-[#3b9fe6]"
              placeholder="you@example.com"
            />
          </div>
          <Button className="w-full bg-[#3b9fe6] hover:bg-blue-700 text-white font-semibold mt-3" disabled={magicSent || !email}>
            {magicSent ? "Check your email!" : "Send magic link"}
          </Button>
          <div className="text-gray-500 mt-4 text-xs text-center">
            Demo login – real email required; stay signed in between sessions.
          </div>
        </form>
      </div>
    );

  // Authenticated
  return <>{children}</>;
};
