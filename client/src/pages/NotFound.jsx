import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ArrowLeft, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-teal-600 flex items-center justify-center mb-4">
        <HeartPulse className="w-8 h-8" />
      </div>

      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h2 className="text-lg font-bold text-slate-700 mt-2">Clinical Record or Page Not Found</h2>
      <p className="text-xs text-slate-500 mt-2 max-w-sm">
        The requested URL does not exist or you may not have authorization to view this medical resource.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
        >
          <Home className="w-4 h-4" />
          <span>Go to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
