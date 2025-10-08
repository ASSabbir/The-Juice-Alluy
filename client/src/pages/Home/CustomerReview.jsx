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
        <div className={`min-h-screen py-9 md:overflow-hidden relative flex z-0 items-center text-darkCoffee bg-white w-full  bg-center`}>
            <img src="/45.png" alt=""  className='absolute opacity-40 -right-80 md:-right-70 xl:-right-45 w-96'/>
            <img src="/coffee-brew-1.png" alt=""  className='absolute -left-30 md:-left-5 opacity-50 -bottom-5 '/>
            <img src="/TREE.png" alt=""  className='absolute top-0 opacity-50 -left-50 md:-left-10  w-78 '/>
            <div className="flex justify-between flex-col w-full  lg:flex-row-reverse items-center h-full px-[12vw]">

                <div className=" w-full  md:w-1/2 ">
                    <div className='flex  items-center gap-2 text-2xl font-urbanist'>
                        <FiCoffee className='mb-1' />
                        <h1 >Client Stories</h1>
                    </div>
                    <h1 className='text-4xl xl:text-5xl 2xl:text-6xl font-moglan mt-5  w-full xl:text-nowrap'>Loved By Many Customers</h1>
                    <SwiperPage></SwiperPage>
                    <div className='mt-12'>
                        <NavLink to={'/shop'}>
                            <button className='bg-lightCoffee hover:bg-mediumCoffee hover:text-white duration-300 text-backgrondDark px-5 py-2 rounded-full'>Buy Coffee</button>
                        </NavLink>
                    </div>
                </div>
                
                <div className='md:w-1/2 relative flex flex-col md:flex-row justify-center items-center'>
                    
                    <img
                        src="/8.png"
                        alt=""
                        className='absolute z-0 w-96 left-20 '
                    />

                    
                    <div className="md:w-96 rounded-t-full z-10">
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
                        className='absolute z-10 w-30 -rotate-25 left-20 md:left-36 top-15 md:top-25 '
                    />
                </div>

            </div>
        </div>
    );
};

export default CustomerReview;