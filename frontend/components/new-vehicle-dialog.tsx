"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

import { createVehicle } from "@/lib/vehicle-store";
import {
    type NewVehicleFormValues,
    newVehicleSchema,
  } from "@/schemas/new-vehicle.schema";
import { NewVehicle, Vehicle } from "@/types/vehicle";

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

const NewVehicleDialog = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<NewVehicleFormValues>({
    resolver: zodResolver(newVehicleSchema),
    defaultValues: {
      plate: "",
      brand: "",
      model: "",
      year: 2026,
      renavam: "",
    },
  });

  const createVehicleMutation = useMutation({
    mutationFn: async (values: NewVehicleFormValues) => {
      const newVehicle: NewVehicle = {
        plate: values.plate,
        brand: values.brand,
        model: values.model,
        year: values.year,
        renavam: values.renavam,
      };

      return createVehicle(newVehicle);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      });

      toast.success("Veículo cadastrado com sucesso!");

      form.reset({
        plate: "",
        brand: "",
        model: "",
        year: 2026,
        renavam: "",
      });

      setOpen(false);
    },
    onError: () => {
      toast.error("Não foi possível cadastrar o veículo.");
    },
  });

  const onSubmit = (values: NewVehicleFormValues) => {
    createVehicleMutation.mutate(values);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          form.reset({
            plate: "",
            brand: "",
            model: "",
            year: 2026,
            renavam: "",
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-dark-emerald text-white hover:bg-dark-emerald/90">
          Novo Veículo
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[560px] bg-white">
        <DialogHeader>
          <DialogTitle>Novo veículo</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para cadastrar um novo veículo.
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
                    htmlFor="new-vehicle-plate"
                    className="text-sm font-medium text-pitch-black"
                  >
                    Placa
                  </label>
                  <Input
                    {...field}
                    id="new-vehicle-plate"
                    placeholder="ABC1D23"
                    maxLength={7}
                    aria-invalid={fieldState.invalid}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                      )
                    }
                    className={
                      fieldState.invalid ? "border-ruby-red focus-visible:ring-ruby-red/20" : ""
                    }
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
        htmlFor="new-vehicle-year"
        className="text-sm font-medium text-pitch-black"
      >
        Ano
      </label>

      <Input
        id="new-vehicle-year"
        type="number"
        min={1990}
        max={2026}
        placeholder="2024"
        value={field.value ?? ""}
        aria-invalid={fieldState.invalid}
        onChange={(e) => {
          const rawValue = e.target.value;

          field.onChange(rawValue === "" ? undefined : Number(rawValue));
        }}
        className={
          fieldState.invalid
            ? "border-ruby-red focus-visible:ring-ruby-red/20"
            : ""
        }
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
                    htmlFor="new-vehicle-brand"
                    className="text-sm font-medium text-pitch-black"
                  >
                    Marca
                  </label>
                  <Input
                    {...field}
                    id="new-vehicle-brand"
                    placeholder="Toyota"
                    aria-invalid={fieldState.invalid}
                    className={
                      fieldState.invalid ? "border-ruby-red focus-visible:ring-ruby-red/20" : ""
                    }
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
                    htmlFor="new-vehicle-model"
                    className="text-sm font-medium text-pitch-black"
                  >
                    Modelo
                  </label>
                  <Input
                    {...field}
                    id="new-vehicle-model"
                    placeholder="Corolla"
                    aria-invalid={fieldState.invalid}
                    className={
                      fieldState.invalid ? "border-ruby-red focus-visible:ring-ruby-red/20" : ""
                    }
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
                  htmlFor="new-vehicle-renavam"
                  className="text-sm font-medium text-pitch-black"
                >
                  RENAVAM
                </label>
                <Input
                  {...field}
                  id="new-vehicle-renavam"
                  placeholder="12345678901"
                  maxLength={11}
                  aria-invalid={fieldState.invalid}
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/\D/g, ""))
                  }
                  className={
                    fieldState.invalid ? "border-ruby-red focus-visible:ring-ruby-red/20" : ""
                  }
                />
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
              onClick={() => setOpen(false)}
              disabled={createVehicleMutation.isPending}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="bg-dark-emerald text-white hover:bg-dark-emerald/90"
              disabled={createVehicleMutation.isPending}
            >
              {createVehicleMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewVehicleDialog;