import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authApi } from '../api/auth';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('[ProtectedRoute] Checking auth, token exists:', !!token);
      if (!token) {
        console.log('[ProtectedRoute] No token found');
        setIsAuthenticated(false);
        return;
      }

      try {
        console.log('[ProtectedRoute] Calling authApi.getMe()');
        const userInfo = await authApi.getMe();
        console.log('[ProtectedRoute] Auth success, role:', userInfo.role);
        setUserRole(userInfo.role);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('[ProtectedRoute] Auth failed:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return <Outlet />;
}
