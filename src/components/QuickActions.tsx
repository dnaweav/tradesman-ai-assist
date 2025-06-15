
import * as React from "react";
import { Mic, File, Mail, Users } from "lucide-react";

type Props = {
  onMic: () => void;
};

export function QuickActions({ onMic }: Props) {
  // Sample actions: Quote, Invoice, Email, Voice, Add Client
  const actions = [
    {
      label: "New Quote",
      icon: File,
      color: "#3b9fe6",
      onClick: () => {},
    },
    {
      label: "Send Email",
      icon: Mail,
      color: "#3b9fe6",
      onClick: () => {},
    },
    {
      label: "Add Client",
      icon: Users,
      color: "#3b9fe6",
      onClick: () => {},
    },
    {
      label: "Voice Note",
      icon: Mic,
      color: "#ffc000",
      onClick: onMic,
    },
  ];
  return (
    <section>
      <div className="text-base font-semibold text-[#333333] mb-2">Quick actions</div>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((a, i) => (
          <button
            key={i}
            className="flex flex-col items-center justify-center rounded-xl border border-[#eaeaea] bg-white shadow-sm py-7 gap-2 hover:bg-[#3b9fe6]/10 transition active:scale-95 cursor-pointer"
            style={{ color: a.color }}
            onClick={a.onClick}
            type="button"
          >
            <a.icon size={32} />
            <span className="font-semibold text-sm" style={{ color: "#333" }}>
              {a.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
