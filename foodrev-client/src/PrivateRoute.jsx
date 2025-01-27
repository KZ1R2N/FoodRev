import React, { useContext } from 'react'
import { Context } from './Context'
import { Navigate, useLocation } from 'react-router';
export default function PrivateRoute({children}) {
    const {userId, loading} = useContext(Context);
    const location = useLocation();
    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        );
    }
    if(userId)
    {
        // console.log(userId)
        return children;
    }
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  
}
