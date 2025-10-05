import React, { useContext } from 'react';

import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../providers/AuthContext';

const Private = ({children}) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className='flex items-center justify-center w-full pt-2 h-screen'>
                <span className="loading loading-bars loading-lg"></span>
            </div>
        );
    }

    if (user) {
        return children;
    } else {
        return <Navigate state={{ from: location }} to={'/login'} replace />;
    }
};

export default Private;
