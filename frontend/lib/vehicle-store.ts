import { NewVehicle, Vehicle } from "@/types/vehicle";
import { mockVehicles } from "@/lib/mock-data";

let vehiclesStore: Vehicle[] = [...mockVehicles];

export const listVehicles = async (): Promise<Vehicle[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return [...vehiclesStore];
};

export const createVehicle = async (
    vehicle: NewVehicle
  ): Promise<Vehicle> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
  
    const newVehicle: Vehicle = {
      ...vehicle,
      id: crypto.randomUUID(), 
      status: "Ativo",
      createdAt: new Date().toISOString(),
    };
  
    vehiclesStore = [newVehicle, ...vehiclesStore];
  
    return newVehicle;
  };