import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse,
  Mail,
  Lock,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  Stethoscope,
  Building,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      toast.success(`Welcome back, ${res.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid credentials';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Quick fill sample credentials helper
  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative backdrop glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-teal-500/20">
            <HeartPulse className="w-8 h-8 text-slate-950 font-bold" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white">
          CarePulse Hospital System
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Sign in to access your clinical or administrative portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-800/90 backdrop-blur border border-slate-700/80 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-400 text-xs font-medium">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hospital.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 pl-10 text-sm text-white placeholder-slate-500 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 pl-10 text-sm text-white placeholder-slate-500 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 py-2.5 px-4 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Quick-Fill helper */}
          <div className="mt-6 pt-5 border-t border-slate-700/80">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
              Quick Test Accounts
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@hospital.com', 'Admin@123')}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/70 hover:bg-slate-900 border border-slate-700/60 hover:border-teal-500/50 text-slate-300 transition text-[11px] group"
              >
                <Building className="w-3.5 h-3.5 text-teal-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-200">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('doctor@hospital.com', 'Doctor@123')}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/70 hover:bg-slate-900 border border-slate-700/60 hover:border-teal-500/50 text-slate-300 transition text-[11px] group"
              >
                <Stethoscope className="w-3.5 h-3.5 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-200">Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('receptionist@hospital.com', 'Reception@123')}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/70 hover:bg-slate-900 border border-slate-700/60 hover:border-teal-500/50 text-slate-300 transition text-[11px] group"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-200">Receptionist</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
