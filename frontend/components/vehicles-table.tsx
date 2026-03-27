"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Table } from "./ui/table";
import { Vehicle } from "@/types/vehicle";
import { ArrowDownUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import VehicleFormDialog from "./vehicle-form-dialog";
import DeleteVehicleDialog from "./delete-vehicle-dialog";

import { getVehicles } from "@/lib/queries/get-vehicles";
import VehiclesTableSkeleton from "./vehicle-table-skeleton";
import VehicleDetailsDialog from "./vehicle-detail-dialog";
import { formatDateBR, getStatusStyles } from "@/lib/utils";
import { VehicleStatusBadge } from "./vehicle-status-badge";
import { Pagination } from "./pagination";
import { SortIcon } from "./sort-icon";

const normalizeStatus = (status: string) =>
  status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const VehiclesTable: React.FC = () => {
  const searchParams = useSearchParams();

  const plateFilter = searchParams.get("placa")?.toLowerCase() || "";
  const statusFilter = searchParams.get("status")?.toLowerCase() || "";

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState<keyof Vehicle>("plate");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const itemsPerPage = 10;

  const {
    data: vehicles = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const handleSort = (key: keyof Vehicle) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
    setCurrentPage(1);
  };

  const handleOpenDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailsOpen(true);
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesPlate = vehicle.plate.toLowerCase().includes(plateFilter);

      const matchesStatus = statusFilter
        ? normalizeStatus(vehicle.status) === statusFilter
        : true;

      return matchesPlate && matchesStatus;
    });
  }, [vehicles, plateFilter, statusFilter]);

  const sortedVehicles = useMemo(() => {
    return [...filteredVehicles].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (sortKey === "createdAt") {
        const aDate =
          typeof aValue === "string" && aValue.length === 10
            ? new Date(`${aValue}T00:00:00`).getTime()
            : new Date(String(aValue)).getTime();

        const bDate =
          typeof bValue === "string" && bValue.length === 10
            ? new Date(`${bValue}T00:00:00`).getTime()
            : new Date(String(bValue)).getTime();

        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredVehicles, sortKey, sortDirection]);

  useEffect(() => {
    setCurrentPage(1);
  }, [plateFilter, statusFilter]);

  const totalPages = Math.ceil(sortedVehicles.length / itemsPerPage);

  const paginatedVehicles = sortedVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem =
    sortedVehicles.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

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

  if (isLoading) {
    return <VehiclesTableSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-ruby-red/20 bg-ruby-red/5 px-4 py-3 text-sm text-ruby-red">
        {error instanceof Error ? error.message : "Falha ao buscar veículos"}
      </div>
    );
  }

  if (paginatedVehicles.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
        Veículo não encontrado
      </div>
    );
  }

  const handleOpenEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setEditOpen(true);
  };

  const handleOpenDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteOpen(true);
  };

  return (
    <div className="space-y-4">
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
                  Placa{" "}
                  <SortIcon
                    column="plate"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </button>
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-pitch-black">
                <button
                  type="button"
                  className="flex items-center gap-2"
                  onClick={() => handleSort("brand")}
                >
                  Marca/Modelo{" "}
                  <SortIcon
                    column="brand"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </button>
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-pitch-black">
                <button
                  type="button"
                  className="flex items-center gap-2"
                  onClick={() => handleSort("year")}
                >
                  Ano{" "}
                  <SortIcon
                    column="year"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </button>
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-pitch-black">
                <button
                  type="button"
                  className="flex items-center gap-2"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  <SortIcon
                    column="status"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </button>
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-pitch-black">
                <button
                  type="button"
                  className="flex items-center gap-2"
                  onClick={() => handleSort("createdAt")}
                >
                  Cadastrado em{" "}
                  <SortIcon
                    column="createdAt"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </button>
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-pitch-black">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedVehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="border-t border-gray-100 transition hover:bg-mint-cream/40"
              >
                <td className="px-4 py-4 text-sm font-medium text-dark-emerald">
                  {vehicle.plate}
                </td>
                <td className="px-4 py-4 text-sm text-pitch-black">
                  {vehicle.brand} {vehicle.model}
                </td>
                <td className="px-4 py-4 text-sm text-pitch-black">
                  {vehicle.year}
                </td>
                <td className="px-4 py-4 text-sm">
                  <div className="min-w-[90px]">
                    <VehicleStatusBadge status={vehicle.status} />
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {formatDateBR(vehicle.createdAt)}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenDetails(vehicle)}
                    >
                      <Eye size={16} />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenEdit(vehicle)}
                    >
                      <Pencil size={16} />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenDelete(vehicle)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startItem={startItem}
        endItem={endItem}
        totalItems={sortedVehicles.length}
        onPageChange={setCurrentPage}
      />

      <VehicleDetailsDialog
        vehicle={selectedVehicle}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <VehicleFormDialog
        vehicle={selectedVehicle}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteVehicleDialog
        vehicle={selectedVehicle}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
};

export default VehiclesTable;
