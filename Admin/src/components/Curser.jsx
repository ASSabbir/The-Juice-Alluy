import { useGSAP } from '@gsap/react';
import React from 'react';
import gsap from 'gsap';
const Curser = () => {
    useGSAP(()=>{
        const handelMouseMove= (e)=>{
           const {clientX,clientY}=e;
           gsap.to('#curser',{
            x:clientX-20,
            y:clientY-2,
            duration:1,
            delay:0,
            ease:"power4.out"
           })   
        }
        
        const home=document.querySelector('#home')
        window.addEventListener('mousemove',handelMouseMove)
    })
    return (
        <div>
            <div id='curser' className='w-4 h-4 mix-blend-difference pointer-events-none fixed top-0 left-0 z-20 rounded-full  bg-lightCoffee'></div>
        </div>
    );
};

export default Curser;