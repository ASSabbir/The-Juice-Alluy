
import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';
import Curser from './components/Curser';

const Root = () => {
    return (
        <div className='font-urbanist  text-lightCoffee bg-backgrondLight '>
            <Nav></Nav>
            <Curser></Curser>
            <Outlet></Outlet>
        </div>
    );
};

export default Root;