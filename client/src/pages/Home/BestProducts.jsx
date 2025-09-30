import React from 'react';
import { FiCoffee } from 'react-icons/fi';

const BestProducts = () => {
    return (
        <div className={`min-h-screen    bg-backgrondDark  w-full  bg-center`}>
            <div className='flex w-full  justify-center items-center gap-2 text-2xl font-urbanist'>
                <FiCoffee className='mb-1' />
                <h1 >Best Coffess</h1>
            </div>
            
        </div>
    );
};

export default BestProducts;