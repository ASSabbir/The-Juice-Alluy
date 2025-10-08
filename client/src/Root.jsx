
import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';
import Curser from './components/Curser';
import { ReactLenis, useLenis } from 'lenis/react'
import Footer from './components/Footer';
const Root = () => {
    
    return (
        <div className='font-urbanist  text-lightCoffee bg-backgrondLight '>
            <Nav></Nav>
            {/* <Curser></Curser> */}
            <Outlet></Outlet>
<Footer></Footer>

            <ReactLenis
                root
                options={{
                    duration: 1.2,        
                    // easing: (t) => 1 - Math.pow(1 - t, 3), 
                    gestureDirection: 'both', 
                    smoothWheel: true,    
                    smoothTouch: true,    
                    touchMultiplier: 1.5,  
                    wheelMultiplier: 2,    
                    infinite: false,       
                }}
            />
        </div>
    );
};

export default Root;