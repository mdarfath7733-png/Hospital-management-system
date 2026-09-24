import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  UserCircle,
  Mail,
  ShieldCheck,
  Calendar,
  LogOut,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { formatDate } from '../utils/formatters';

export const Profile = () => {
  const { user, logout } = useAuth();

  const rolePermissions = {
    admin: [
      'Full administrative access to all hospital staff and employee records',
      'Register new system accounts with specific roles',
      'Create, edit, and permanently delete patient records',
      'View comprehensive analytics, census, and department charts',
      'Discharge patients and update admission assignments',
    ],
    doctor: [
      'Access patient roster and clinical charts',
      'Update diagnostic evaluations, symptoms, and medical history',
      'Prescribe and update patient medications and allergies',
      'Perform discharge authorization for admitted patients',
      'View clinical department analytics',
    ],
    receptionist: [
      'Register and admit new inpatient and outpatient arrivals',
      'Update patient demographics and emergency contact information',
      'Assign attending doctors from the active physician roster',
      'Execute fast patient discharge processing',
      'Access patient registry directory and search tools',
    ],
  };

  const currentPermissions =
    rolePermissions[user?.role?.toLowerCase()] || rolePermissions.receptionist;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Account Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Active session identity and role permissions matrix
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: User Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-teal-500/20 mb-3">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <h2 className="text-base font-bold text-slate-900">{user?.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>

          <div className="mt-3">
            <StatusBadge status={user?.role} size="sm" showDot={false} />
          </div>

          <div className="w-full mt-6 pt-5 border-t border-slate-100 text-left text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account Role</span>
              <span className="font-semibold text-slate-800 capitalize">{user?.role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">User ID</span>
              <span className="font-mono text-slate-600">{user?._id?.slice(-8)}</span>
            </div>
            {user?.createdAt && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Account Created</span>
                <span className="text-slate-700">{formatDate(user.createdAt)}</span>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Right 2 Columns: Permissions Matrix */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Role Permissions & Capabilities
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              Your account has been granted authorization based on the{' '}
              <span className="font-bold text-slate-800 uppercase">{user?.role}</span> security policy:
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700">
              {currentPermissions.map((perm, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{perm}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Security Notice */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-xs text-slate-500 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>HIPAA Compliance & Clinical Security</span>
            </div>
            <p>
              All patient record accesses, diagnostic notes, and discharge actions are logged with
              timestamps and staff session identifiers in compliance with healthcare data regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
