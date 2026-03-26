import { listVehicles } from "@/lib/vehicle-store";

export const getVehicles = async () => {
  return listVehicles();
};