"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export const ClearVehicleFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasFilters =
    searchParams.has("placa") || searchParams.has("status");

  const handleClear = () => {
    router.replace(pathname, { scroll: false });
  };

  return (
    <button
      type="button"
      onClick={handleClear}
      disabled={!hasFilters}
      className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-pitch-black transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Limpar filtros
    </button>
  );
};