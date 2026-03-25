"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Skeleton } from "./ui/skeleton";
import { Table } from "./ui/table";
import { Vehicle } from "@/types/vehicle";
import { ArrowDownUp, ChevronLeft, ChevronRight } from "lucide-react";

const formatDateBR = (date: string) => {
    if (date.length === 10) {
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    }
  
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

const VehiclesTable: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState<keyof Vehicle>("plate");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1200));

        const response = await import("@/lib/mock-data");
        const data = response.mockVehicles;
        setVehicles(data);
      } catch (err) {
        setError("Falha ao buscar veículos");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleSort = (key: keyof Vehicle) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
    setCurrentPage(1);
  };

  const sortedVehicles = useMemo(() => {
    return [...vehicles].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [vehicles, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedVehicles.length / itemsPerPage);

  const paginatedVehicles = sortedVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem = sortedVehicles.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, sortedVehicles.length);

  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const renderSkeletonTable = () => {
    return (
      <div className="w-full border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-mint-cream border-b border-gray-200 px-4 py-4">
          <Skeleton className="h-5 w-40" />
        </div>

        <div className="divide-y divide-gray-100">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-5 gap-4 px-4 py-4 items-center"
            >
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {loading ? (
        renderSkeletonTable()
      ) : error ? (
        <div className="rounded-xl border border-ruby-red/20 bg-ruby-red/5 px-4 py-3 text-sm text-ruby-red">
          {error}
        </div>
      ) : paginatedVehicles.length === 0 ? (
        <div className="rounded-xl border border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
          Veículos não encontrados
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
            <Table className="w-full">
              <thead className="bg-mint-cream">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-pitch-black">
                    <button
                      type="button"
                      className="flex items-center gap-2"
                      onClick={() => handleSort("plate")}
                    >
                      Placa <ArrowDownUp size={16} />
                    </button>
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-pitch-black">
                    <button
                      type="button"
                      className="flex items-center gap-2"
                      onClick={() => handleSort("brand")}
                    >
                      Marca/Modelo <ArrowDownUp size={16} />
                    </button>
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-pitch-black">
                    <button
                      type="button"
                      className="flex items-center gap-2"
                      onClick={() => handleSort("year")}
                    >
                      Ano <ArrowDownUp size={16} />
                    </button>
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-pitch-black">
                    <button
                      type="button"
                      className="flex items-center gap-2"
                      onClick={() => handleSort("status")}
                    >
                      Status <ArrowDownUp size={16} />
                    </button>
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-pitch-black">
                    <button
                      type="button"
                      className="flex items-center gap-2"
                      onClick={() => handleSort("createdAt")}
                    >
                      Cadastrado em <ArrowDownUp size={16} />
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.plate}
                    className="border-t border-gray-100 transition hover:bg-mint-cream/40"
                  >
                    <td className="px-4 py-4 text-sm text-pitch-black">
                      {vehicle.plate}
                    </td>
                    <td className="px-4 py-4 text-sm text-pitch-black">
                    {vehicle.brand} {vehicle.model}
                    </td>
                    <td className="px-4 py-4 text-sm text-pitch-black">
                      {vehicle.year}
                    </td>
                    <td className="px-4 py-4 text-sm">
                        <div className="min-w-[90px]"><span
                        className={`
                          inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                          ${
                            vehicle.status === "Ativo"
                              ? "bg-dark-emerald/10 text-dark-emerald"
                              : ""
                          }
                          ${
                            vehicle.status === "Inativo"
                              ? "bg-ruby-red/10 text-ruby-red"
                              : ""
                          }
                          ${
                            vehicle.status === "Manutenção"
                              ? "bg-indigo-velvet/10 text-indigo-velvet"
                              : ""
                          }
                        `}
                      >
                        {vehicle.status}
                      </span></div>
                      
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                    {formatDateBR(vehicle.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-500">
              Mostrando <span className="font-medium text-pitch-black">{startItem}</span>–
              <span className="font-medium text-pitch-black">{endItem}</span> de{" "}
              <span className="font-medium text-pitch-black">{sortedVehicles.length}</span> veículos
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="cursor-pointer inline-flex h-9 items-center justify-center rounded-md border border-gray-200 px-3 text-sm font-medium text-pitch-black transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>

              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition cursor-pointer ${
                    currentPage === page
                      ? "border-dark-emerald bg-dark-emerald text-white"
                      : "border-gray-200 text-pitch-black hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="cursor-pointer inline-flex h-9 items-center justify-center rounded-md border border-gray-200 px-3 text-sm font-medium text-pitch-black transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VehiclesTable;