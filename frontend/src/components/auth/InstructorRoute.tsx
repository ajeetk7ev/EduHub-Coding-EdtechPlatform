import { useAuthStore } from '@/store/authStore'
import { ACCOUNT_TYPE } from '@/constants/role'
import React from 'react'
import { Navigate } from 'react-router-dom';

interface InstructorRouteProps {
    children: React.ReactNode
}

function InstructorRoute({ children }: InstructorRouteProps) {
    const { token, user } = useAuthStore();

    if (!token) {
        return <Navigate to="/login" />
    }

    if (user?.role !== ACCOUNT_TYPE.INSTRUCTOR) {
        return <Navigate to="/" />
    }

    return <>{children}</>
}

export default InstructorRoute
