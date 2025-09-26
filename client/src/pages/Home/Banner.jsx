import React from 'react';
import bg from '/beans-bg.png'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
const Banner = () => {
    useGSAP(() => {
        gsap.to("#ring", {
            rotate: 360,
            repeat: -1,
            duration: 9,
            ease: "linear"
        });
        gsap.to('#bean1',{
            x:50,
            y:10,
            duration:9,
            repeat:-1,
            yoyo:1,
            ease:'linear'
        })
        gsap.to('#bean2',{
            x:-10,
            y:-50,
            duration:7,
            delay:0.1,
            repeat:-1,
            yoyo:1,
            ease:'linear'
        })
        gsap.to('#bean2-1',{
            opacity:0,
        
            duration:7,
            delay:0.1,
            repeat:-1,
            yoyo:1,
            ease:'linear'
        })
        gsap.to('#bean3',{
            x:20,
            y:10,
            duration:7,
            delay:0.1,
            repeat:-1,
            yoyo:1,
            ease:'linear'
        })
    });

    return (
        <div className={`h-screen  relative  bg-[#100a08] overflow-hidden`}>
            <div className="absolute inset-0 bg-[url('/beans-bg.png')] bg-bottom bg-no-repeat bg-cover opacity-20"></div>
            <div className="relative  flex flex-col md:flex-row justify-center px-[9vw] items-center h-full  text-white">
                <div className='md:w-1/2 '>
                    <div className='text-5xl md:text-[5.5vw] relative z-10 uppercase tracking-tight md:leading-32'>
                        <h1 >Sip Best <span className='text-lightCoffee'>&</span></h1>
                        <h1 className=''>Enjoy Taste</h1>
                    </div>
                </div>
                <div className='md:w-1/2 relative '>
                    <img src="/banner1.png" alt="" className='z-10 relative' />
                    <img id='ring' src="ring.png" alt="" className='absolute top-0 z-0  scale-110' />
                </div>
            </div>
            <div id='bean1' className="absolute inset-0 bg-[url('/bean1.png')] opacity-40 top-[70%]  h-96 left-[29%] scale-75 bg-no-repeat w-96 "></div>
            <div id='bean2' className="absolute inset-0 bg-[url('/bean2.png')] opacity-40 top-[25%]  h-96 left-[19%] scale-75 bg-no-repeat w-96 "></div>
            <div id='bean2-1' className="absolute inset-0 bg-[url('/bean2.png')] opacity-40 top-[5%]  h-96 left-[80%] scale-75 bg-no-repeat w-96 "></div>
            <div id='bean3' className="absolute inset-0 bg-[url('/bean3.png')] opacity-25 top-[10%]  h-96 left-[36%] scale-75 bg-no-repeat w-96 "></div>
        </div>
    );
};

export default Banner;