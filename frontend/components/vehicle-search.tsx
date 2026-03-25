"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export const VehicleSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");

  useEffect(() => {
    const placa = searchParams.get("placa") || "";
    setValue(placa);
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("placa", value.trim());
      } else {
        params.delete("placa");
      }

      const query = params.toString();
      router.push(query ? `?${query}` : "?");
    }, 400);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="relative w-full max-w-sm">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={16}
      />

      <input
        type="text"
        placeholder="Buscar placa..."
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-dark-emerald focus:ring-2 focus:ring-dark-emerald/20"
      />
    </div>
  );
};