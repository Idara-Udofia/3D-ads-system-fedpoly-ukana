import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'editor' | 'visitor'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-mono">Verifying Staff Credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const dashboard = user.role === 'admin' ? '/admin/dashboard' : '/editor/dashboard';
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4 text-center">
        <h2 className="text-xl font-bold text-rose-400">Access Denied</h2>
        <p className="text-xs text-slate-400 mt-2">
          Your role ({user.role}) does not have permission to view this section.
        </p>
        <a
          href={dashboard}
          className="mt-4 px-4 py-2 bg-slate-800 text-xs font-semibold rounded-lg"
        >
          Return to Dashboard
        </a>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
