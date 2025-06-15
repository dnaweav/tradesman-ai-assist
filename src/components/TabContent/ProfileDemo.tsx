
import * as React from "react";
import { User } from "lucide-react";

export function ProfileDemo() {
  // Placeholder content
  return (
    <section>
      <div className="font-bold text-lg text-[#333] mb-3 flex items-center gap-2">
        <User className="text-[#3b9fe6]" /> Profile
      </div>
      <div className="bg-white rounded-xl p-6 shadow border border-[#eaeaea]">
        <div className="font-bold mb-2">John Smith</div>
        <div className="text-sm text-gray-700">Plumber | Huddersfield, UK</div>
        <div className="text-[#fcba03] text-xs mt-2">Pro member</div>
        <div className="flex gap-4 mt-6">
          <button className="px-4 py-2 rounded bg-[#3b9fe6] text-white font-semibold hover:bg-blue-700 transition text-xs">
            Edit profile
          </button>
          <button className="px-4 py-2 rounded border border-[#eaeaea] bg-[#eaeaea] text-[#333] transition text-xs">
            Log out
          </button>
        </div>
      </div>
    </section>
  );
}
