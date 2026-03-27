"use client";

import { Vehicle } from "@/types/vehicle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { formatDateBR, getStatusStyles } from "@/lib/utils";
import { VehicleStatusBadge } from "./vehicle-status-badge";

interface VehicleDetailsDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-pitch-black">
        {value ?? "—"}
      </p>
    </div>
  );
};

const VehicleDetailsDialog = ({
  vehicle,
  open,
  onOpenChange,
}: VehicleDetailsDialogProps) => {
  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-pitch-black">
            <span>Detalhes do veículo</span>
            <VehicleStatusBadge status={vehicle.status} />
          </DialogTitle>

          <DialogDescription>
            Visualize todas as informações cadastradas para o veículo{" "}
            <span className="font-medium text-pitch-black">
              {vehicle.plate}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <DetailItem label="Placa" value={vehicle.plate} />
          <DetailItem label="Ano" value={vehicle.year} />
          <DetailItem label="Marca" value={vehicle.brand} />
          <DetailItem label="Modelo" value={vehicle.model} />
          <DetailItem label="Status" value={vehicle.status} />
          <DetailItem label="RENAVAM" value={vehicle.renavam} />
          <DetailItem
            label="Data de cadastro"
            value={formatDateBR(vehicle.createdAt)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsDialog;
