"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createVehicle, updateVehicle } from "@/lib/vehicle-store";
import {
  newVehicleSchema,
  type NewVehicleFormValues,
} from "@/schemas/new-vehicle.schema";
import { type NewVehicle, type Vehicle } from "@/types/vehicle";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

interface NewVehicleDialogProps {
  trigger?: React.ReactNode;
  vehicle?: Vehicle | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const getDefaultValues = (
  vehicle?: Vehicle | null
): NewVehicleFormValues => ({
  plate: vehicle?.plate ?? "",
  brand: vehicle?.brand ?? "",
  model: vehicle?.model ?? "",
  year: vehicle?.year ?? 2026,
  renavam: vehicle?.renavam ?? "",
  status: vehicle?.status ?? "Ativo",
});

const VehicleFormDialog = ({
  trigger,
  vehicle,
  open: controlledOpen,
  onOpenChange,
}: NewVehicleDialogProps) => {
  const isEditMode = !!vehicle;
  const [internalOpen, setInternalOpen] = useState(false);
  const queryClient = useQueryClient();

  const open = controlledOpen ?? internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(nextOpen);
      return;
    }

    setInternalOpen(nextOpen);
  };

  const form = useForm<NewVehicleFormValues>({
    resolver: zodResolver(newVehicleSchema),
    defaultValues: getDefaultValues(vehicle),
  });

  useEffect(() => {
    form.reset(getDefaultValues(vehicle));
  }, [vehicle, form]);

  const saveVehicleMutation = useMutation({
    mutationFn: async (values: NewVehicleFormValues) => {
      const payload: NewVehicle = {
        plate: values.plate,
        brand: values.brand,
        model: values.model,
        year: values.year,
        renavam: values.renavam,
        status: values.status,
      };

      if (isEditMode && vehicle) {
        return updateVehicle(vehicle.id, payload);
      }

      return createVehicle(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      });

      form.reset(getDefaultValues(null));
      handleOpenChange(false);
      toast.success(
        isEditMode
          ? "Veículo atualizado com sucesso!"
          : "Veículo cadastrado com sucesso!"
      );
    },
    onError: () => {
      toast.error(
        isEditMode
          ? "Não foi possível atualizar o veículo."
          : "Não foi possível cadastrar o veículo."
      );
    },
  });

  const onSubmit = (values: NewVehicleFormValues) => {
    saveVehicleMutation.mutate(values);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        handleOpenChange(nextOpen);

        if (!nextOpen) {
          form.reset(getDefaultValues(vehicle));
        }
      }}
    >
      {controlledOpen === undefined && (
  <DialogTrigger asChild>
    {trigger ?? (
      <Button className="bg-dark-emerald py-5 px-4 text-[16px] text-white cursor-pointer">
        Novo Veículo
      </Button>
    )}
  </DialogTrigger>
)}

      <DialogContent
        className="bg-white sm:max-w-[560px]"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar veículo" : "Novo veículo"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize os dados do veículo."
              : "Preencha os dados abaixo para cadastrar um novo veículo."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              name="plate"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label
                    htmlFor="vehicle-plate"
                    className="text-sm font-medium text-pitch-black"
                  >
                    Placa
                  </label>
                  <Input
                    {...field}
                    id="vehicle-plate"
                    placeholder="ABC1D23"
                    maxLength={7}
                    aria-invalid={fieldState.invalid}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                      )
                    }
                    className={fieldState.invalid ? "border-ruby-red" : ""}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-ruby-red">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="year"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label
                    htmlFor="vehicle-year"
                    className="text-sm font-medium text-pitch-black"
                  >
                    Ano
                  </label>
                  <Input
                    id="vehicle-year"
                    type="number"
                    min={1990}
                    max={2026}
                    placeholder="2024"
                    value={field.value ?? ""}
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      field.onChange(
                        rawValue === "" ? undefined : Number(rawValue)
                      );
                    }}
                    className={fieldState.invalid ? "border-ruby-red" : ""}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-ruby-red">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="brand"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label
                    htmlFor="vehicle-brand"
                    className="text-sm font-medium text-pitch-black"
                  >
                    Marca
                  </label>
                  <Input
                    {...field}
                    id="vehicle-brand"
                    placeholder="Toyota"
                    aria-invalid={fieldState.invalid}
                    className={fieldState.invalid ? "border-ruby-red" : ""}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-ruby-red">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="model"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label
                    htmlFor="vehicle-model"
                    className="text-sm font-medium text-pitch-black"
                  >
                    Modelo
                  </label>
                  <Input
                    {...field}
                    id="vehicle-model"
                    placeholder="Corolla"
                    aria-invalid={fieldState.invalid}
                    className={fieldState.invalid ? "border-ruby-red" : ""}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-ruby-red">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <Controller
            name="renavam"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <label
                  htmlFor="vehicle-renavam"
                  className="text-sm font-medium text-pitch-black"
                >
                  RENAVAM
                </label>
                <Input
                  {...field}
                  id="vehicle-renavam"
                  placeholder="12345678901"
                  maxLength={11}
                  aria-invalid={fieldState.invalid}
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/\D/g, ""))
                  }
                  className={fieldState.invalid ? "border-ruby-red" : ""}
                />
                {fieldState.error && (
                  <p className="text-sm text-ruby-red">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <label
                  htmlFor="vehicle-status"
                  className="text-sm font-medium text-pitch-black"
                >
                  Status
                </label>
                <select
                  id="vehicle-status"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={fieldState.invalid}
                  className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none ${
                    fieldState.invalid
                      ? "border-ruby-red"
                      : "border-gray-300 focus:border-dark-emerald"
                  }`}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Manutenção">Manutenção</option>
                </select>
                {fieldState.error && (
                  <p className="text-sm text-ruby-red">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => handleOpenChange(false)}
              disabled={saveVehicleMutation.isPending}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="bg-dark-emerald text-white hover:bg-dark-emerald/90 cursor-pointer"
              disabled={saveVehicleMutation.isPending}
            >
              {saveVehicleMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleFormDialog;