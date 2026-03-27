import { Vehicle } from "@/types/vehicle";
import { ArrowDownUp, ArrowUp, ArrowDown } from "lucide-react";

export const SortIcon = ({
  column,
  sortKey,
  sortDirection,
}: {
  column: keyof Vehicle;
  sortKey: keyof Vehicle;
  sortDirection: "asc" | "desc";
}) => {
  if (column !== sortKey)
    return <ArrowDownUp size={16} className="text-gray-400" />;
  return sortDirection === "asc" ? (
    <ArrowUp size={16} className="text-dark-emerald" />
  ) : (
    <ArrowDown size={16} className="text-dark-emerald" />
  );
};
