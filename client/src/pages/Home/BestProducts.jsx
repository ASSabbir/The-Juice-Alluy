import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FiCoffee } from 'react-icons/fi';
import Card from '../../components/card/Card';
import BestCard from '../../components/card/BestCard';

const BestProducts = () => {
    const [datas,setDatas]=useState([])
    useEffect(()=>{
       axios.get('http://localhost:5000/best_products')
       .then(res=> setDatas(res.data))
    },[])
    return (
        <div className={` py-[9vw]   bg-backgrondDark  w-full  bg-center`}>
            <div className='flex w-full pb-[4vw] justify-center items-center gap-2 text-2xl font-urbanist'>
                <FiCoffee className='mb-1' />
                <h1>Best Coffess</h1>
            </div>
            <div className="grid  space-y-20  px-[9vw] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {datas.map((coffee) => <BestCard key={coffee._id} coffee={coffee}></BestCard>)}
        </div>
            
        </div>
    );
};

export default BestProducts;