import React from 'react';

const badgeStyles = {
  // Patient statuses
  'Admitted': 'bg-blue-100 text-blue-700 border-blue-200',
  'Under Treatment': 'bg-amber-100 text-amber-800 border-amber-200',
  'Discharged': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Critical': 'bg-rose-100 text-rose-700 border-rose-200 font-semibold animate-pulse',

  // Staff statuses
  'Active': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'On Leave': 'bg-amber-100 text-amber-800 border-amber-200',
  'Resigned': 'bg-slate-100 text-slate-600 border-slate-200',

  // Patient Types
  'Inpatient': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Outpatient': 'bg-teal-50 text-teal-700 border-teal-200',

  // Roles
  'admin': 'bg-purple-100 text-purple-700 border-purple-200 font-medium',
  'doctor': 'bg-cyan-100 text-cyan-800 border-cyan-200 font-medium',
  'receptionist': 'bg-teal-100 text-teal-700 border-teal-200 font-medium',
  'Doctor': 'bg-cyan-100 text-cyan-800 border-cyan-200 font-medium',
  'Nurse': 'bg-pink-100 text-pink-700 border-pink-200 font-medium',
  'Pharmacist': 'bg-emerald-100 text-emerald-800 border-emerald-200 font-medium',
  'Lab Technician': 'bg-amber-100 text-amber-800 border-amber-200 font-medium',
  'Admin': 'bg-purple-100 text-purple-700 border-purple-200 font-medium',
  'Other': 'bg-slate-100 text-slate-700 border-slate-200 font-medium',
};

const dotColors = {
  'Admitted': 'bg-blue-500',
  'Under Treatment': 'bg-amber-500',
  'Discharged': 'bg-emerald-500',
  'Critical': 'bg-rose-500',
  'Active': 'bg-emerald-500',
  'On Leave': 'bg-amber-500',
  'Resigned': 'bg-slate-400',
};

export const StatusBadge = ({ status, showDot = true, size = 'sm', className = '' }) => {
  if (!status) return null;

  const styleClass = badgeStyles[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  const dotColor = dotColors[status];

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses[size] || sizeClasses.sm} ${styleClass} ${className}`}
    >
      {showDot && dotColor && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      )}
      {status}
    </span>
  );
};

export default StatusBadge;
