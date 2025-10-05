import React from 'react';
import { CiCoffeeCup } from 'react-icons/ci';
import { FiCoffee } from 'react-icons/fi';
import { GoClock } from 'react-icons/go';
import { SiCoffeescript } from "react-icons/si";
import { MdEventAvailable } from "react-icons/md";
import { SiBuymeacoffee } from "react-icons/si";

const OurJourney = () => {
    return (
        <div className="relative bg-backgrondDark  flex flex-col justify-center items-center">
            <div className="absolute inset-0 opacity-50 brightness-50 bg-[url('/journey.png')] bg-bottom bg-no-repeat bg-cover bg-center filter grayscale "></div>
            <div className="flex pt-[10vw] pb-[15vw] px-[15vw] relative w-full justify-between flex-col md:flex-row items-center h-full px-[12vw]">

                <div className="  w-full  md:w-1/2">
                    <div className='flex  items-center gap-2 text-xl font-urbanist'>
                        <FiCoffee className='mb-1' />
                        <h1 >Our Journey Of Success</h1>
                    </div>
                    <h1 className='text-6xl font-moglan mt-5 text-white'>Our Journey Of Success</h1>

                </div>
                <div className='md:w-1/2  h relative flex flex-col md:flex-row justify-center items-center'>


                </div>
            </div>
            <div className='w-full px-[15vw] pb-[7vw]'>
                <div className='flex justify-between w-full border-t-2 pt-15 items-center '>
                    <div className='flex group relative flex-col md:flex-row  gap-3 mt-5'>
                        <div class='group-hover:bg-lightCoffee group-hover:shadow-lg group-hover:shadow-amber-500/30 group-hover:text-zinc-800 
            duration-250 cursor-default bg-zinc-800 p-5 w-fit flex justify-center items-center text-4xl rounded-full 
            shadow-lg shadow-zinc-950/50 group'>
                            <CiCoffeeCup />
                        </div>
                        <div className='text-white'>
                            <h1 className='text-4xl font-mogla'>300+</h1>
                            <h1> Daily Customer</h1>
                        </div>
                    </div>
                    <div className='flex group relative flex-col md:flex-row  gap-3 mt-5'>
                        <div class='group-hover:bg-lightCoffee group-hover:shadow-lg group-hover:shadow-amber-500/30 group-hover:text-zinc-800 
            duration-250 cursor-default bg-zinc-800 p-5 w-fit flex justify-center items-center text-4xl rounded-full 
            shadow-lg shadow-zinc-950/50 group'>
                            <SiCoffeescript />
                        </div>
                        <div className='text-white'>
                            <h1 className='text-4xl font-mogla'>50</h1>
                            <h1> Recipes Created</h1>
                        </div>
                    </div>
                    <div className='flex group relative flex-col md:flex-row  gap-3 mt-5'>
                        <div class='group-hover:bg-lightCoffee group-hover:shadow-lg group-hover:shadow-amber-500/30 group-hover:text-zinc-800 
            duration-250 cursor-default bg-zinc-800 p-5 w-fit flex justify-center items-center text-4xl rounded-full 
            shadow-lg shadow-zinc-950/50 group'>
                           <MdEventAvailable />
                        </div>
                        <div className='text-white'>
                            <h1 className='text-4xl font-mogla'>120 +</h1>
                            <h1>Events Hosted</h1>
                        </div>
                    </div>
                    <div className='flex group relative flex-col md:flex-row  gap-3 mt-5'>
                        <div class='group-hover:bg-lightCoffee group-hover:shadow-lg group-hover:shadow-amber-500/30 group-hover:text-zinc-800 
            duration-250 cursor-default bg-zinc-800 p-5 w-fit flex justify-center items-center text-4xl rounded-full 
            shadow-lg shadow-zinc-950/50 group'>
                            <SiBuymeacoffee />

                        </div>
                        <div className='text-white'>
                            <h1 className='text-4xl font-mogla'>500 +</h1>
                            <h1> Happy Customers</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurJourney;