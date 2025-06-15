
import React, { useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { useEffect } from "react";

const panels = [
  {
    icon: "🛠",
    headline: "Voice in. Admin out.",
    desc: "Send quotes, emails, invoices from your voice.",
    example: '"Send a quote for £800 to John Smith."',
  },
  {
    icon: "🗃",
    headline: "Stay Organised",
    desc: "Every job has its own thread.",
    example: "Threaded chats for Jobs, Clients & Docs.",
  },
  {
    icon: "🧠",
    headline: "Knows Your Business",
    desc: "Your assistant is trained on your tone, services and pricing.",
    example: '"Draft follow-up in my style."',
  },
  {
    icon: "🔧",
    headline: "No faff. Just sorted.",
    desc: "Works from your phone – no dashboards, no logins.",
    example: "Always ready, on any site.",
  },
];

type WelcomeTourProps = {
  onClose: () => void;
};
export function WelcomeTour({ onClose }: WelcomeTourProps) {
  const [index, setIndex] = useState(0);
  const [dontShow, setDontShow] = useState(false);

  // Read preference on mount (localStorage)
  useEffect(() => {
    const hideTour = localStorage.getItem("hideWelcomeTour");
    if (hideTour === "1") {
      onClose();
    }
  }, [onClose]);

  const handleFinish = () => {
    if (dontShow) localStorage.setItem("hideWelcomeTour", "1");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#eaeaea]/90 flex flex-col items-center justify-center z-50">
      <div className="rounded-2xl bg-white shadow-2xl w-full max-w-xs mx-auto py-8 px-4 animate-fade-in relative">
        <Carousel
          opts={{
            align: "center",
            skipSnaps: true,
            loop: false,
            axis: "x",
            inViewThreshold: 0.4,
            startIndex: 0
          }}
        >
          <CarouselContent>
            {panels.map((p, i) => (
              <CarouselItem key={i} className={`transition-opacity duration-300 ${i === index ? "opacity-100" : "opacity-10 pointer-events-none"}`}>
                <div className="flex flex-col items-center gap-3 select-none">
                  <div className="text-5xl" aria-label={p.headline}>{p.icon}</div>
                  <h2 className="text-xl font-bold text-[#3b9fe6] text-center">{p.headline}</h2>
                  <div className="text-base font-medium text-[#333333] text-center">{p.desc}</div>
                  <div className="bg-[#ffc000]/30 text-[#3b9fe6] rounded-xl p-2 text-[13px] font-mono mt-3">
                    {p.example}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex mt-7 gap-2 justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 mr-2 active:scale-95 transition-transform"
            onClick={onClose}
          >
            Skip
          </Button>
          {index < panels.length - 1 ? (
            <Button
              className="flex-1 active:scale-95 transition-transform"
              onClick={() => setIndex((idx) => Math.min(idx + 1, panels.length - 1))}
            >
              Next
            </Button>
          ) : (
            <Button
              className="flex-1 active:scale-95 transition-transform"
              onClick={handleFinish}
            >
              Get Started
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-6">
          <Checkbox
            id="dont-show-tour"
            checked={dontShow}
            onCheckedChange={(val) => setDontShow(!!val)}
          />
          <label
            htmlFor="dont-show-tour"
            className="text-xs text-gray-700 select-none"
          >
            Don’t show this again
          </label>
        </div>
        <div className="flex space-x-2 justify-center mt-3">
          {panels.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${i === index ? "bg-[#3b9fe6]" : "bg-[#eaeaea]"}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
