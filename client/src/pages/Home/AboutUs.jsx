import img from '/pexels-pavel-danilyuk-6612648.jpg'
import { FiCoffee } from "react-icons/fi";
import { CiCoffeeCup } from "react-icons/ci";
import { GoClock } from "react-icons/go";
import { NavLink } from "react-router-dom";
import { DiCoffeescript } from "react-icons/di";

const AboutUs = () => {
    return (
        <div className={`min-h-screen flex items-center bg-[url('/bg-2.jpg')] w-full bg-center`}>
            <div className="flex justify-between flex-col md:flex-row items-center h-full px-4 sm:px-8 md:px-[8vw] lg:px-[12vw] py-8 md:py-0">
                
                <div className="w-full md:w-1/2 mb-8 md:mb-0">
                    <div className='flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-urbanist'>
                        <FiCoffee className='mb-1' />
                        <h1>About Us</h1>
                    </div>
                    <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-moglan mt-5 text-white'>Bringing People Together One Cup At A Time</h1>
                    
                    <div className='flex flex-col sm:flex-row gap-3 mt-5'>
                        <div className='bg-zinc-800 p-4 sm:p-5 w-fit flex justify-center items-center text-3xl sm:text-4xl rounded-full'>
                            <CiCoffeeCup className='' />
                        </div>
                        <div className='text-white'>
                            <h1 className='text-xl sm:text-2xl'>Food Delivery</h1>
                            <h1 className='text-sm sm:text-base'>With our fast and reliable food delivery service, your favorite coffee, snacks, and treats are just a click away.</h1>
                        </div>
                    </div>
                    
                    <div className='flex flex-col sm:flex-row gap-3 mt-5'>
                        <div className='bg-zinc-800 p-4 sm:p-5 w-fit flex justify-center items-center text-3xl sm:text-4xl rounded-full'>
                            <CiCoffeeCup className='' />
                        </div>
                        <div className='text-white'>
                            <h1 className='text-xl sm:text-2xl'>Food Delivery</h1>
                            <h1 className='text-sm sm:text-base'>With our fast and reliable food delivery service, your favorite coffee, snacks, and treats are just a click away.</h1>
                        </div>
                    </div>
                    
                    <div className='mt-8 sm:mt-10 md:mt-12'>
                        <NavLink to='/about' className='mr-5 text-backgrondDark font-semibold underline'>
                            <button className='bg-lightCoffee text-backgrondDark px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base'>More About Us</button>
                        </NavLink>
                    </div>
                </div>
                
                <div className='w-full md:w-1/2 h relative flex flex-col md:flex-row justify-center items-center'>
                    <div className="w-64 sm:w-80 md:w-96 rounded-t-full border-2">
                        <img src={img} alt="" className='object-center rounded-t-full object-cover' />
                    </div>
                    
                    <div className='bg-white rounded-2xl -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:-bottom-20 md:right-10 lg:right-20 w-64 sm:w-72 p-4 sm:p-5 absolute font-urbanist text-gray-700'>
                        <div className='w-fit rounded-full text-white p-2 bg-gray-700'>
                            <GoClock className='text-xl sm:text-2xl'></GoClock>
                        </div>
                        <h1 className='font-bold text-lg sm:text-xl mt-3'>Open Hours</h1>
                        <div className='flex justify-between mt-2 text-sm sm:text-base'>
                            <h1>Monday - Friday</h1>
                            <h1>09.30 - 7.30</h1>
                        </div>
                        <div className='flex justify-between text-sm sm:text-base'>
                            <h1>Saturday</h1>
                            <h1>10.30 - 9.30</h1>
                        </div>
                        <div className='flex justify-between text-sm sm:text-base'>
                            <h1>Sunday</h1>
                            <h1>24 Hours open</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;