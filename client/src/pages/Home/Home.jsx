import React from 'react';
import Banner from './Banner';
import OurWork from './OurWork';
import Marque from './Marque';
import AboutUs from './AboutUs';
import BestProducts from './BestProducts';
import OurJourney from './OurJourney';

const Home = () => {
    return (
        <div id='home' className=' '>
            <Banner></Banner>
            <Marque></Marque>
            <AboutUs></AboutUs>
            <BestProducts></BestProducts>
            <OurJourney></OurJourney>
            {/* <OurWork></OurWork> */}
        </div>
    );
};

export default Home;