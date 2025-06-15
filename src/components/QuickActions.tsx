
import * as React from "react";
import { File, Mail, Users, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

const actionCards = [
  {
    label: "New Quote",
    icon: File,
    iconGradient: "from-[#3b9fe6] to-[#6fdcff]",
    desc: "Create estimates fast\nwith AI assistance.",
    onClick: () => {},
  },
  {
    label: "Send Email",
    icon: Mail,
    iconGradient: "from-[#3b9fe6] to-[#66d2ff]",
    desc: "Professional emails\nwritten instantly.",
    onClick: () => {},
  },
  {
    label: "Add Client",
    icon: Users,
    iconGradient: "from-[#3b9fe6] to-[#ffc000]",
    desc: "Save contacts and\njob details easily.",
    onClick: () => {},
  },
  {
    label: "Voice Note",
    icon: Mic,
    iconGradient: "from-[#ffc000] to-[#ff9500]",
    desc: "Say what you need.\nWe'll write it up.",
    onClick: undefined, // Will be set by prop
  },
];

type Props = {
  onMic: () => void;
};

export function QuickActions({ onMic }: Props) {
  // Assign the mic button
  const cards = React.useMemo(
    () =>
      actionCards.map((a) =>
        a.label === "Voice Note"
          ? { ...a, onClick: onMic }
          : a
      ),
    [onMic]
  );

  return (
    <section aria-label="Quick Actions">
      <div className="text-xl font-semibold mb-4 px-0 text-[#333333]">Quick actions</div>
      <div className="grid grid-cols-2 gap-4">
        {cards.map((a, i) => (
          <button
            // Glassmorphic card style + animation
            key={a.label}
            type="button"
            onClick={a.onClick}
            className={cn(
              "relative group flex flex-col items-center justify-center h-36 rounded-2xl bg-white/30 border border-[#eaeaea]/60 shadow-xl overflow-hidden transition will-change-transform",
              "backdrop-blur-lg",
              "active:scale-95 focus:ring-2 focus:ring-[#3b9fe6] hover:shadow-2xl"
            )}
            style={{
              minWidth: 0,
              WebkitBackdropFilter: "blur(12px) saturate(180%)"
            }}
          >
            {/* Animated Gradient Icon */}
            <span
              className={cn(
                "rounded-full mb-1 flex items-center justify-center shadow-xl transition group-active:scale-110 group-hover:scale-105 bg-gradient-to-br",
                a.iconGradient,
                "w-12 h-12"
              )}
            >
              <a.icon size={28} className="text-white drop-shadow" />
            </span>
            <span className="font-semibold text-base text-[#333333]">{a.label}</span>
            <span className="mt-1 text-sm leading-snug text-muted-foreground text-center whitespace-pre-line px-2 font-normal opacity-90">
              {a.desc}
            </span>
            {/* Animated glass shine */}
            <span className="pointer-events-none absolute top-0 left-0 w-full h-full block [mask-image:linear-gradient(70deg,transparent_50%,white_90%,transparent_100%)] animate-card-shine z-10" />
          </button>
        ))}
      </div>
    </section>
  );
}
