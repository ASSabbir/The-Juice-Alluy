import img from '/9.png'
import { FiCoffee } from "react-icons/fi";
import { CiCoffeeCup } from "react-icons/ci";
import { GoClock } from "react-icons/go";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SwiperPage from '../../utils/SwiperPage';
import { NavLink } from 'react-router-dom';

const CustomerReview = () => {
    useGSAP(()=>{
        gsap.to('#coffeebean',{
            x:5,
            y:10,
            duration:3,
            repeat:-1,
            yoyo:1,
            ease:'linear'
        })
    })
    
    return (
        <div className={`min-h-screen py-9 overflow-hidden relative flex z-0 items-center text-darkCoffee bg-white w-full bg-center`}>
            <img src="/45.png" alt="" className='absolute opacity-40 -right-40 sm:-right-60 md:-right-70 xl:-right-45 w-64 sm:w-80 md:w-96'/>
            <img src="/coffee-brew-1.png" alt="" className='absolute -left-20 sm:-left-25 md:-left-30 lg:-left-5 opacity-50 -bottom-5 w-32 sm:w-40 md:w-auto'/>
            <img src="/TREE.png" alt="" className='absolute top-0 opacity-50 -left-30 sm:-left-40 md:-left-50 lg:-left-10 w-48 sm:w-60 md:w-78'/>
            
            <div className="flex justify-between flex-col w-full lg:flex-row-reverse items-center h-full px-4 sm:px-8 md:px-[8vw] lg:px-[12vw]">

                <div className="w-full md:w-1/2">
                    <div className='flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-urbanist'>
                        <FiCoffee className='mb-1' />
                        <h1>Client Stories</h1>
                    </div>
                    <h1 className='text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-moglan mt-5 w-full xl:text-nowrap'>Loved By Many Customers</h1>
                    <SwiperPage></SwiperPage>
                    <div className='mt-8 sm:mt-10 md:mt-12'>
                        <NavLink to={'/shop'}>
                            <button className='bg-lightCoffee hover:bg-mediumCoffee hover:text-white duration-300 text-backgrondDark px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base'>Buy Coffee</button>
                        </NavLink>
                    </div>
                </div>
                
                <div className='w-full md:w-1/2 relative flex flex-col md:flex-row justify-center items-center mt-8 lg:mt-0'>
                    
                    <img
                        src="/8.png"
                        alt=""
                        className='absolute z-0 w-64 sm:w-80 md:w-96 left-10 sm:left-12 md:left-20'
                    />

                    
                    <div className="w-64 sm:w-80 md:w-96 rounded-t-full z-10">
                        <img
                            src={img}
                            alt=""
                            className='object-center rounded-t-full object-cover'
                        />
                    </div>
                    
                    <img
                        id='coffeebean'
                        src="/4.png"
                        alt=""
                        className='absolute z-10 w-20 sm:w-24 md:w-30 -rotate-25 left-10 sm:left-16 md:left-20 lg:left-36 top-10 sm:top-12 md:top-15 lg:top-25'
                    />
                </div>

            </div>
        </div>
    );
};

export default CustomerReview;