
import * as React from "react";
import { MessageSquare } from "lucide-react";

export function ChatsList() {
  // Demo chats
  const chats = [
    {
      id: "1",
      type: "Client",
      title: "Sarah Jones - New kitchen quote",
      snippet: "“Hi Sarah — just a quick follow-up on that quote…”",
      color: "#3b9fe6",
      badge: "Quote",
    },
    {
      id: "2",
      type: "Supplier",
      title: "Dulux Paints - Order update",
      snippet: "“Good news — your order is on its way.”",
      color: "#ffc000",
      badge: "Supplier",
    },
    {
      id: "3",
      type: "Promo",
      title: "Instagram post draft",
      snippet: "“Let me know if you’ve got any questions — happy to tweak things.”",
      color: "#3b9fe6",
      badge: "Promo",
    },
  ];
  return (
    <section>
      <div className="font-bold text-lg text-[#333] mb-3 flex items-center gap-2">
        <MessageSquare className="text-[#3b9fe6]" /> Chats
      </div>
      <ul className="space-y-4">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="p-4 rounded-xl bg-white shadow border border-[#eaeaea] flex flex-col gap-1 hover:bg-[#3b9fe6]/10 transition cursor-pointer"
          >
            <span className="font-semibold text-md mb-1" style={{ color: chat.color }}>
              {chat.title}
            </span>
            <span className="text-gray-600 text-sm">{chat.snippet}</span>
            <span className="inline-block text-xs font-semibold px-2 py-1 rounded mt-1" style={{ background: "#eaeaea", color: chat.color }}>
              {chat.badge}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
