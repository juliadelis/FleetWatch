export type VehicleStatus = "Ativo" | "Inativo" | "Manutenção";

export interface NewVehicle {
  plate: string;
  brand: string;
  model: string;
  year: number;
  renavam: string;
  status?: VehicleStatus;
}

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  renavam: string;
  status: VehicleStatus;
  createdAt: string;
}