import React from 'react';
import Marquee from "react-fast-marquee";
const Marque = () => {
    return (
        <div>
            <Marquee autoFill={1} className='text-6xl font-moglan bg-lightCoffee uppercase text-darkCoffee py-2'>
                Espresso&nbsp;&nbsp;-&nbsp;&nbsp;Americano&nbsp;&nbsp;-&nbsp;&nbsp;Cappuccino&nbsp;&nbsp;-&nbsp;&nbsp;Latte&nbsp;&nbsp;-&nbsp;&nbsp;Mocha&nbsp;&nbsp;-&nbsp;&nbsp;Iced Americano&nbsp;&nbsp;-&nbsp;&nbsp;Morning Bliss Brew&nbsp;&nbsp;-&nbsp;&nbsp;Velvet Roast&nbsp;&nbsp;-
            </Marquee>
        </div>
    );
};

export default Marque;