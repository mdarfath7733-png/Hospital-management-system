import React from 'react';
import { Menu, Bell, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../common/StatusBadge';

export const Navbar = ({ onOpenSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Online • HMS CarePulse v1.0</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User Pill */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-800">{user?.name}</div>
            <div className="text-[11px] text-slate-400 capitalize">{user?.role}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-teal-100">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
