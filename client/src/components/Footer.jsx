import { SlPhone } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";
import { CiClock1 } from "react-icons/ci";
import { FaFacebookF } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
const Footer = () => {
    return (
        <div>
            <div className="relative">
                <div className="absolute inset-0 opacity-50 brightness-50 bg-[url('/36.jpg')] bg-bottom bg-no-repeat bg-cover filter grayscale"></div>
                <div className="flex relative flex-col md:flex-row justify-center  items-center p-10 ">
                    <div className="text-2xl flex flex-col items-center space-y-2 p-3 md:p-15 border-white  md:border-r-1">
                        <SlPhone className=" text-4xl md:text-6xl  " />
                        <h1 className=" text-2xl md:text-4xl  font-moglan  font-mogla mt-4">Contact Us</h1>
                        <h1 className="text-lg md:text-xl text-white">01798392494</h1>
                        <h1 className="text-lg md:text-xl text-white">juicealluy1125@gmail.com</h1>
                    </div>
                    <div className="text-2xl flex flex-col items-center space-y-2 p-3 md:p-15 border-white  md:border-r-1">
                        <IoLocationOutline className=" text-4xl md:text-6xl  " />
                        <h1 className=" text-2xl md:text-4xl   font-mogla mt-4 font-moglan">Address</h1>
                        <h1 className="text-lg md:text-xl text-white">House 11, Road 06</h1>
                        <h1 className="text-lg md:text-xl text-white">Block L, Mirpur 12, Pallabi</h1>
                    </div>
                    <div className="text-2xl flex flex-col items-center space-y-2 p-3 md:p-15">
                        <CiClock1 className="  text-4xl md:text-6xl  " />
                        <h1 className=" text-2xl md:text-4xl    font-mogla mt-4 font-moglan">Opening Hours</h1>
                        <h1 className="text-lg md:text-xl text-white">Monday to Friday
                            09.30 - 7.30</h1>
                        <h1 className="text-lg md:text-xl text-white">Sunday
                            24 Hours open</h1>
                    </div>
                </div>
                <div className="flex py-9 justify-between items-center relative border-t-1 mx-[10vw] px-[5vw] border-white">
                    <h1>Copyright © 2025 All Rights Reserved.</h1>
                    <div className="flex text-3xl justify-center items-center gap-5">
                        <FaFacebookF  className="bg-lightCoffee text-white p-2 md:text-5xl rounded-full"/>
                        <AiFillInstagram  className="bg-lightCoffee text-white p-2 md:text-5xl rounded-full"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;