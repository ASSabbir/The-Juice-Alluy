import React from 'react';
import Banner from './Banner';
import OurWork from './OurWork';
import Marque from './Marque';
import AboutUs from './AboutUs';

const Home = () => {
    return (
        <div id='home' className=' '>
            <Banner></Banner>
            <Marque></Marque>
            <AboutUs></AboutUs>
            <OurWork></OurWork>
        </div>
    );
};

export default Home;