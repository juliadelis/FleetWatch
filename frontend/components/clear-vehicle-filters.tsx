"use client";

import { useRouter, useSearchParams } from "next/navigation";

export const ClearVehicleFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasFilters =
    searchParams.has("placa") || searchParams.has("status");

  const handleClear = () => {
    router.push("?");
  };

  return (
    <button
      type="button"
      onClick={handleClear}
      disabled={!hasFilters}
      className="cursor-pointer inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-pitch-black transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Limpar filtros
    </button>
  );
};