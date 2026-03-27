import { Suspense } from "react";
import { ClearVehicleFilters } from '@/components/clear-vehicle-filters';
import { VehicleSearch } from '@/components/vehicle-search';
import { VehicleStatusFilter } from '@/components/vehicle-status-filter';
import VehiclesTableSkeleton from '@/components/vehicle-table-skeleton';
import VehiclesTable from '@/components/vehicles-table';
import React from 'react';
import VehicleFormDialog from "@/components/vehicle-form-dialog";


const Page: React.FC = () => {
    return (
        <div className="p-8 flex flex-col gap-4">
            <div>
                <h2 className='font-bold text-3xl text-dark-emerald'>Gerenciamento de veículos</h2>
            </div>
            <div>
                <VehicleFormDialog />
            </div>
            
            <div className='flex gap-3 rounded-xl border border-gray-200 px-4 py-4 md:items-center '>
                <VehicleSearch />
                <VehicleStatusFilter />
                <ClearVehicleFilters />
            </div>
            
            <Suspense fallback={<VehiclesTableSkeleton />}>
                <VehiclesTable />
            </Suspense>
        </div>
    );
};

export default Page;
