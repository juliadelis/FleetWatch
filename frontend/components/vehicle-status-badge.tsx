import { getStatusStyles } from "@/lib/utils";
import { VehicleStatus } from "@/types/vehicle";

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyles(
        status
      )}`}
    >
      {status}
    </span>
  );
}
