
import * as React from "react";
import { Support } from "lucide-react";

export function SupportDemo() {
  return (
    <section>
      <div className="font-bold text-lg text-[#333] mb-3 flex items-center gap-2">
        <Support className="text-[#3b9fe6]" /> Support
      </div>
      <div className="bg-white rounded-xl p-6 shadow border border-[#eaeaea]">
        <div className="font-semibold mb-2">Need help?</div>
        <div className="text-sm text-gray-700 mb-2">
          Reach out for a hand with anything, big or small — we’ll get you sorted, no faff.
        </div>
        <div className="text-gray-500 text-xs mb-2">support@thetradesmen.ai</div>
        <button className="mt-1 px-4 py-2 rounded bg-[#3b9fe6] text-white font-semibold hover:bg-blue-700 transition text-xs">
          Message support
        </button>
      </div>
    </section>
  );
}
