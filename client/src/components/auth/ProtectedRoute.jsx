import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../common/Loader';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader message="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role?.toLowerCase();
    const hasPermission = allowedRoles.some((r) => r.toLowerCase() === userRole);

    if (!hasPermission) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md">
            Your role (<span className="font-semibold text-slate-700 capitalize">{user?.role}</span>) does not have sufficient permissions to view this section.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
