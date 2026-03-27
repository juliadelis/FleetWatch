import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateBR = (date: string) => {
  if (date.length === 10) {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

export const getStatusStyles = (status: string) => {
  if (status === "Ativo") {
    return "bg-dark-emerald/10 text-dark-emerald";
  }

  if (status === "Inativo") {
    return "bg-ruby-red/10 text-ruby-red";
  }

  if (status === "Manutenção") {
    return "bg-indigo-velvet/10 text-indigo-velvet";
  }

  return "bg-gray-100 text-gray-700";
};
