import { NewVehicle, Vehicle } from "@/types/vehicle";
import { mockVehicles } from "@/lib/mock-data";

let vehiclesStore: Vehicle[] = [...mockVehicles];

export const listVehicles = async (): Promise<Vehicle[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return [...vehiclesStore];
};

export const createVehicle = async (vehicle: NewVehicle): Promise<Vehicle> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newVehicle: Vehicle = {
    ...vehicle,
    id: crypto.randomUUID(),
    status: vehicle.status ?? "Ativo",
    createdAt: new Date().toISOString(),
  };

  vehiclesStore = [newVehicle, ...vehiclesStore];
  return newVehicle;
};

export const updateVehicle = async (
  id: string,
  vehicle: NewVehicle
): Promise<Vehicle> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const currentVehicle = vehiclesStore.find((item) => item.id === id);

  if (!currentVehicle) {
    throw new Error("Veículo não encontrado.");
  }

  const updatedVehicle: Vehicle = {
    ...currentVehicle,
    ...vehicle,
    status: vehicle.status ?? currentVehicle.status,
  };

  vehiclesStore = vehiclesStore.map((item) =>
    item.id === id ? updatedVehicle : item
  );

  return updatedVehicle;
};

export const deleteVehicle = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  vehiclesStore = vehiclesStore.filter((item) => item.id !== id);
};