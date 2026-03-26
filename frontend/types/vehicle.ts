export interface NewVehicle {
    plate: string;
    brand: string;
    model: string;
    year: number;
    renavam: string;
    
  }
  
  export interface Vehicle extends NewVehicle {
    id: string;
    status: "Ativo" | "Inativo" | "Manutenção";
    createdAt: string;
  }