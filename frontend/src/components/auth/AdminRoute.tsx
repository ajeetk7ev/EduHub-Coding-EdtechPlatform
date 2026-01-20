import { useAuthStore } from '@/store/authStore'
import { ACCOUNT_TYPE } from '@/constants/role'
import React from 'react'
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
    children: React.ReactNode
}

function AdminRoute({ children }: AdminRouteProps) {
    const { token, user } = useAuthStore();

    if (!token) {
        return <Navigate to="/login" />
    }

    if (user?.role !== ACCOUNT_TYPE.ADMIN) {
        return <Navigate to="/" />
    }

    return <>{children}</>
}

export default AdminRoute
