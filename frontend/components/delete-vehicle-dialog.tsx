"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteVehicle } from "@/lib/vehicle-store";
import { Vehicle } from "@/types/vehicle";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";

interface DeleteVehicleDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteVehicleDialog = ({
  vehicle,
  open,
  onOpenChange,
}: DeleteVehicleDialogProps) => {
  const queryClient = useQueryClient();

  const deleteVehicleMutation = useMutation({
    mutationFn: async () => {
      if (!vehicle) {
        throw new Error("Veículo não encontrado.");
      }

      return deleteVehicle(vehicle.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      });

      toast.success("Veículo excluído com sucesso.");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Não foi possível excluir o veículo.");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-white">
        <DialogHeader>
          <DialogTitle>Excluir veículo</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o veículo{" "}
            <span className="font-medium text-pitch-black">
              {vehicle?.plate}
            </span>
            ? Essa ação não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteVehicleMutation.isPending}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() => deleteVehicleMutation.mutate()}
            disabled={deleteVehicleMutation.isPending}
          >
            {deleteVehicleMutation.isPending ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteVehicleDialog;