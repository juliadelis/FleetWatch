import VehiclesTable from '@/components/vehicles-table';
import React from 'react';


const Page: React.FC = () => {
    return (
        <div className="p-8 flex flex-col gap-8">
            <div>
            <h2 className='font-bold text-3xl text-dark-emerald'>Gerenciamento de veículos</h2>
            </div>
            
           <VehiclesTable />
        </div>
    );
};

export default Page;
