

import { useAuthStore } from '@/store/authStore'
import React from 'react'
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps{
    children:React.ReactNode
}

function OpenRoute({children}:PrivateRouteProps) {
    const { token } = useAuthStore();
     if(token === null)
        return children
     else
        return <Navigate to="/dashboard/my-profile" />
}

export default OpenRoute