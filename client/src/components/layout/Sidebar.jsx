import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserCheck,
  Activity,
  HeartPulse,
  LogOut,
  UserCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../common/StatusBadge';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'doctor', 'receptionist'],
    },
    {
      label: 'Patients',
      path: '/patients',
      icon: Users,
      roles: ['admin', 'doctor', 'receptionist'],
    },
    {
      label: 'Staff Directory',
      path: '/staff',
      icon: UserCheck,
      roles: ['admin'], // Admin only
    },
    {
      label: 'My Profile',
      path: '/profile',
      icon: UserCircle,
      roles: ['admin', 'doctor', 'receptionist'],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role?.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between h-16 px-6 bg-slate-950/60 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <HeartPulse className="w-5 h-5 text-slate-950 font-bold" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight">CarePulse</h1>
                <p className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase">
                  Hospital System
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Main Menu
            </div>
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center text-teal-100 font-bold border border-teal-600/50">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              <div className="mt-1">
                <StatusBadge status={user?.role} size="xs" showDot={false} />
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-rose-900/50 hover:text-rose-200 rounded-lg transition-colors border border-slate-700/50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
