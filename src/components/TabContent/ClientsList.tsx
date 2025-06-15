
import * as React from "react";
import { Users } from "lucide-react";

export function ClientsList() {
  // Demo clients
  const clients = [
    {
      id: "c1",
      name: "Sarah Jones",
      jobs: 2,
      last: "Quoted for kitchen – Mar 2024",
    },
    {
      id: "c2",
      name: "Tom Richards",
      jobs: 1,
      last: "Invoice sent – Apr 2024",
    },
  ];
  return (
    <section>
      <div className="font-bold text-lg text-[#333] mb-3 flex items-center gap-2">
        <Users className="text-[#3b9fe6]" /> Clients
      </div>
      <ul className="space-y-3">
        {clients.map((client) => (
          <li
            key={client.id}
            className="p-4 rounded-xl bg-white shadow border border-[#eaeaea] flex flex-col gap-1 hover:bg-[#3b9fe6]/10 transition cursor-pointer"
          >
            <span className="font-semibold text-md">{client.name}</span>
            <span className="text-xs text-gray-500">
              {client.jobs} job{client.jobs > 1 ? "s" : ""}
            </span>
            <span className="text-sm text-gray-600">{client.last}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 text-sm font-medium text-[#3b9fe6] hover:underline cursor-pointer">+ Add new client</div>
    </section>
  );
}
