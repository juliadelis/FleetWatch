"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "../hooks/use-debounce";

export const VehicleSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const placaParam = (searchParams.get("placa") || "").toUpperCase();

  const [value, setValue] = useState(placaParam);
  const debouncedValue = useDebounce(value, 400);

  const lastTypedValueRef = useRef(placaParam);

 
  useEffect(() => {
    if (placaParam !== lastTypedValueRef.current) {
      setValue(placaParam);
      lastTypedValueRef.current = placaParam;
    }
  }, [placaParam]);

  useEffect(() => {
    const normalized = debouncedValue.trim().toUpperCase();

    if (normalized === placaParam) return;
    if(debouncedValue !== lastTypedValueRef.current) return;

    const params = new URLSearchParams(searchParams.toString());

    if (normalized) {
      params.set("placa", normalized);
    } else {
      params.delete("placa");
    }

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [debouncedValue, placaParam, pathname, router, searchParams]);

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
        onChange={(e) => {
          const nextValue = e.target.value.toUpperCase();
          setValue(nextValue);
          lastTypedValueRef.current = nextValue;
        }}
        className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-dark-emerald focus:ring-2 focus:ring-dark-emerald/20"
      />
    </div>
  );
};