
import * as React from "react";
import { File } from "lucide-react";

export function DocsList() {
  // Demo docs
  const docs = [
    {
      id: "d1",
      title: "Sarah Jones – Garden fencing quote",
      date: "2 Apr 2024",
      type: "Quote",
      color: "#3b9fe6",
    },
    {
      id: "d2",
      title: "Tom Richards – Kitchen invoice",
      date: "20 Mar 2024",
      type: "Invoice",
      color: "#ffc000",
    },
  ];
  return (
    <section>
      <div className="font-bold text-lg text-[#333] mb-3 flex items-center gap-2">
        <File className="text-[#3b9fe6]" /> Documents
      </div>
      <ul className="space-y-3">
        {docs.map((doc) => (
          <li
            key={doc.id}
            className="p-4 rounded-xl bg-white shadow border border-[#eaeaea] flex flex-col gap-1 hover:bg-[#3b9fe6]/10 transition cursor-pointer"
          >
            <span className="font-semibold text-md">{doc.title}</span>
            <span className="text-xs text-gray-500">{doc.type}</span>
            <span className="text-sm text-gray-600">{doc.date}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 text-sm font-medium text-[#3b9fe6] hover:underline cursor-pointer">+ Add document</div>
    </section>
  );
}
