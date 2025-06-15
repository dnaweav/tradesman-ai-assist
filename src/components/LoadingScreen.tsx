
import React from "react";
import { Logo } from "./Logo";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eaeaea] flex-col relative px-4">
      <div className="mb-6">
        <Logo size={64} />
      </div>
      <div className="relative flex items-center justify-center">
        <div className="w-32 h-3 rounded-full bg-[#3b9fe6]/20 overflow-hidden animate-pulse">
          <div className="absolute left-0 top-0 h-3 bg-[#3b9fe6] rounded-full animate-[shimmer_1.2s_linear_infinite]" style={{ width: 36 }}></div>
        </div>
      </div>
      <div className="mt-6 text-lg font-medium text-[#333333] text-center">
        Warming up your assistant…
      </div>
      <div className="text-xs text-gray-400 mt-2 text-center">
        If this takes more than 5 seconds, refresh the app.
      </div>
      <style>{`
        @keyframes shimmer {
          0% { left: -40px; }
          100% { left: 140px; }
        }
      `}</style>
    </div>
  );
}
