"use client";

import { Skeleton } from "./ui/skeleton";

const VehiclesTableSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-mint-cream px-4 py-4">
          <div className="grid grid-cols-5 gap-4">
            <Skeleton className="h-4 w-20 bg-dark-emerald" />
            <Skeleton className="h-4 w-28 bg-dark-emerald" />
            <Skeleton className="h-4 w-16 bg-dark-emerald" />
            <Skeleton className="h-4 w-20 bg-dark-emerald" />
            <Skeleton className="h-4 w-28 bg-dark-emerald" />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-5 items-center gap-4 px-4 py-4"
            >
              <Skeleton className="h-4 w-20 bg-mint-cream" />
              <Skeleton className="h-4 w-36 bg-mint-cream" />
              <Skeleton className="h-4 w-12 bg-mint-cream" />
              <Skeleton className="h-6 w-24 rounded-full bg-mint-cream" />
              <Skeleton className="h-4 w-24 bg-mint-cream" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-4 w-52" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-md bg-mint-cream" />
          <Skeleton className="h-9 w-9 rounded-md bg-mint-cream" />
          <Skeleton className="h-9 w-9 rounded-md bg-mint-cream" />
        </div>
      </div>
    </div>
  );
};

export default VehiclesTableSkeleton;
