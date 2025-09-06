import { useAuthStore } from '@/store/authStore'
import React from 'react'
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps{
    children:React.ReactNode
}

function PrivateRoute({children}:PrivateRouteProps) {
    const { token } = useAuthStore();
     if(token !== null)
        return children
     else
        return <Navigate to="/login" />
}

export default PrivateRoute