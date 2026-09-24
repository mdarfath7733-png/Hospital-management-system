import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  };

  return (
    <Loader2
      className={`animate-spin text-teal-600 ${sizeClasses[size] || sizeClasses.md} ${className}`}
    />
  );
};

export const PageLoader = ({ message = 'Loading hospital records...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-teal-600 rounded-full" />
        </div>
      </div>
      <p className="text-slate-500 font-medium text-sm tracking-wide">{message}</p>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full space-y-3 animate-pulse p-4">
      <div className="h-10 bg-slate-200 rounded-md w-full mb-4" />
      {[...Array(rows)].map((_, rIdx) => (
        <div key={rIdx} className="flex gap-4">
          {[...Array(cols)].map((_, cIdx) => (
            <div key={cIdx} className="h-8 bg-slate-100 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PageLoader;
