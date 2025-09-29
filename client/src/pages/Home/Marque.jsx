import React from 'react';
import Marquee from "react-fast-marquee";
const Marque = () => {
    return (
        <div>
            <Marquee autoFill={1} className='text-6xl font-moglan uppercase bg-lightCoffee  text-darkCoffee py-5'>
                Espresso&nbsp;&nbsp;-&nbsp;&nbsp;Americano&nbsp;&nbsp;-&nbsp;&nbsp;Cappuccino&nbsp;&nbsp;-&nbsp;&nbsp;Latte&nbsp;&nbsp;-&nbsp;&nbsp;Mocha&nbsp;&nbsp;-&nbsp;&nbsp;Iced Americano&nbsp;&nbsp;-&nbsp;&nbsp;Morning Bliss Brew&nbsp;&nbsp;-&nbsp;&nbsp;Velvet Roast&nbsp;&nbsp;-&nbsp;&nbsp;
            </Marquee>
        </div>
    );
};

export default Marque;