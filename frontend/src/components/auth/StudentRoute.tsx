import { useAuthStore } from '@/store/authStore'
import { ACCOUNT_TYPE } from '@/constants/role'
import React from 'react'
import { Navigate } from 'react-router-dom';

interface StudentRouteProps {
    children: React.ReactNode
}

function StudentRoute({ children }: StudentRouteProps) {
    const { token, user } = useAuthStore();

    if (!token) {
        return <Navigate to="/login" />
    }

    if (user?.role !== ACCOUNT_TYPE.STUDENT) {
        return <Navigate to="/" />
    }

    return <>{children}</>
}

export default StudentRoute
