
import * as React from "react";

// "Start Talking" button triggers assistant callback (placeholder)
export function HeroSection({ onCTA }: { onCTA?: () => void }) {
  return (
    <section className="w-full flex flex-col items-center justify-center gap-6 max-w-md mx-auto">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg mb-2">
        Your AI Admin Assistant
      </h1>
      {/* Subheading */}
      <p className="text-lg text-white/90 text-center max-w-xs mb-2">
        Turn your voice into quotes, emails, invoices and more — hands-free.
      </p>
      {/* Yellow Call to Action */}
      <button
        onClick={onCTA}
        className="mt-6 bg-[#ffc000] hover:shadow-[0_0_16px_0_rgba(255,224,102,0.7)] transition-all ease-in-out text-[#20232a] font-semibold text-lg px-8 py-3 rounded-xl focus:outline-none active:scale-95"
        type="button"
      >
        Start Talking
      </button>
    </section>
  );
}
