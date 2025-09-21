
import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';

const Root = () => {
    return (
        <div className='font-inter text-lightCoffee bg-backgrondLight '>
            <Nav></Nav>
            <Outlet></Outlet>
        </div>
    );
};

export default Root;