import { Outlet } from 'react-router-dom';
import Navbar from './components/dashboard/Admin/NavBar/Navbar';

const Root = () => {
    return (
        <div className='font-urbanist text-lightCoffee bg-backgrondLight min-h-screen'>
            <div className='flex'>
                {/* Sidebar */}
                <div className='w-64 flex-shrink-0'>
                    <Navbar></Navbar>
                </div>

                {/* Main Content Area */}
                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default Root;