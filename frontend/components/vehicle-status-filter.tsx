"use client";

import { useRouter, useSearchParams } from "next/navigation";

const statusOptions = [
  { label: "Todos os status", value: "" },
  { label: "Ativo", value: "ativo" },
  { label: "Inativo", value: "inativo" },
  { label: "Manutenção", value: "manutencao" },
];

export const VehicleStatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }

    const query = params.toString();
    router.push(query ? `?${query}` : "?");
  };

  return (
    <div className="w-full max-w-[220px]">
      <select
        value={currentStatus}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-pitch-black outline-none transition focus:border-dark-emerald focus:ring-2 focus:ring-dark-emerald/20"
      >
        {statusOptions.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};