import img from '/pexels-pavel-danilyuk-6612648.jpg'
import { FiCoffee } from "react-icons/fi";
import { CiCoffeeCup } from "react-icons/ci";
import { GoClock } from "react-icons/go";
import { NavLink } from "react-router-dom";
import { DiCoffeescript } from "react-icons/di";

const AboutUs = () => {
    return (
        <div className={`min-h-screen flex  items-center bg-[url('/bg-2.jpg')]  w-full  bg-center`}>
            <div className="flex justify-between flex-col md:flex-row items-center h-full px-[12vw]">

                <div className="   md:w-1/2">
                    <div className='flex  items-center gap-2 text-2xl font-urbanist'>
                        <FiCoffee className='mb-1' />
                        <h1 >About Us</h1>
                    </div>
                    <h1 className='text-6xl font-moglan mt-5 text-white'>Bringing People Together One Cup At A Time</h1>
                    <div className='flex flex-col md:flex-row  gap-3 mt-8 space-y-7'>
                        <div className='  bg-zinc-800 p-5 w-fit flex justify-center items-center text-4xl rounded-full'>
                            <DiCoffeescript className='' />
                        </div>
                        <div className='text-white'>
                            <h1 className='text-2xl'>Fresh Coffee</h1>
                            <h1>Experience the aroma of freshly brewed coffee delivered straight to your door.
We bring you quality blends, quick service, and the perfect sip every time.</h1>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-3 mt-5'>
                        <div className='  bg-zinc-800 p-5 w-fit flex justify-center items-center text-4xl rounded-full'>
                            <CiCoffeeCup className='' />
                        </div>
                        <div className='text-white'>
                            <h1 className='text-2xl'>Coffee Delivery</h1>
                            <h1>Enjoy your favorite coffee and snacks anytime, anywhere! With our quick and reliable delivery service, your perfect cup of coffee is just a click away.</h1>
                        </div>
                    </div>
                    <div className='mt-12'>

                        <NavLink  to='/about' className='bg-lightCoffee hover:bg-darkCoffee duration-300 hover:text-white text-backgrondDark px-8 py-3 rounded-full'>More About Us</NavLink>


                    </div>
                </div>
                <div className='md:w-1/2 h relative flex flex-col md:flex-row justify-center items-center'>
                    <div className=" md:w-96  rounded-t-full border-2">
                        <img src={img} alt="" className=' object-center rounded-t-full object-cover' />
                    </div>
                    <div className='bg-white rounded-2xl -bottom-20 md:right-20 w-72 p-5 absolute font-urbanist text-gray-700'>
                        <div className='w-fit rounded-full text-white p-2 bg-gray-700 '>
                            <GoClock className='text-2xl'></GoClock>
                        </div>
                        <h1 className='font-bold text-xl mt-3'>Open Hours</h1>
                        <div className='flex justify-between mt-2'>
                            <h1>Monday - Friday</h1>
                            <h1>09.30 - 7.30</h1>
                        </div>
                        <div className='flex justify-between '>
                            <h1>Saturday</h1>
                            <h1>10.30 - 9.30</h1>
                        </div>
                        <div className='flex justify-between '>
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