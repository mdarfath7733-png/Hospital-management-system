import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Activity,
  HeartPulse,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  PlusCircle,
  Building,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { dashboardApi } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import { PageLoader } from '../components/common/Loader';
import { formatDate } from '../utils/formatters';

const STATUS_COLORS = {
  'Admitted': '#3b82f6',        // Blue
  'Under Treatment': '#f59e0b', // Amber
  'Discharged': '#10b981',      // Emerald
  'Critical': '#f43f5e',        // Rose
};

export const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      setError('Unable to load hospital analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <PageLoader message="Loading dashboard analytics..." />;
  }

  if (error || !stats) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center text-rose-700">
        <p className="font-semibold">{error || 'Failed to fetch data'}</p>
        <button
          onClick={fetchStats}
          className="mt-3 px-4 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const {
    totalStaff,
    totalPatients,
    admitted,
    discharged,
    critical,
    underTreatment,
    doctorsCount,
    patientsByDepartment,
    patientStatusDistribution,
    recentAdmissions,
  } = stats;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold tracking-wide uppercase border border-teal-500/30 mb-2">
            Clinical Operations Overview
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time admissions, active departments, and patient census monitoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {hasRole('admin') && (
            <Link
              to="/staff/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-teal-400" />
              <span>Add Staff</span>
            </Link>
          )}

          {(hasRole('admin') || hasRole('receptionist')) && (
            <Link
              to="/patients/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Admit Patient</span>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon={Users}
          variant="teal"
          subtitle="Cumulative registry"
        />
        <StatCard
          title="Admitted"
          value={admitted}
          icon={Activity}
          variant="blue"
          subtitle="Currently in wards"
        />
        <StatCard
          title="Under Treatment"
          value={underTreatment || 0}
          icon={HeartPulse}
          variant="amber"
          subtitle="Active clinical care"
        />
        <StatCard
          title="Critical"
          value={critical}
          icon={AlertCircle}
          variant="rose"
          subtitle="Requires intensive care"
        />
        <StatCard
          title="Discharged"
          value={discharged}
          icon={CheckCircle2}
          variant="emerald"
          subtitle="Recovered / released"
        />
        <StatCard
          title="Doctors"
          value={doctorsCount}
          icon={Stethoscope}
          variant="purple"
          subtitle={`Out of ${totalStaff} staff`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Patients by Department
              </h2>
              <p className="text-xs text-slate-500">Distribution across hospital specialty units</p>
            </div>
            <span className="text-xs font-medium text-slate-400">Live Census</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={patientsByDepartment}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val) => [`${val} Patients`, 'Census']}
                />
                <Bar
                  dataKey="count"
                  fill="#0d9488"
                  radius={[6, 6, 0, 0]}
                  name="Patient Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Patient Status Breakdown
            </h2>
            <p className="text-xs text-slate-500">Inpatient vs discharge proportions</p>
          </div>

          <div className="h-60 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={patientStatusDistribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {patientStatusDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.status] || '#94a3b8'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Tracked Statuses:</span>
            <span className="font-semibold text-slate-700">{totalPatients} Patients</span>
          </div>
        </div>
      </div>

      {/* Recent Admissions Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Recent Admissions
            </h2>
            <p className="text-xs text-slate-500">Latest patients admitted to hospital units</p>
          </div>
          <Link
            to="/patients"
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700"
          >
            <span>View All Patients</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Patient ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Assigned Doctor</th>
                <th className="px-4 py-3">Admitted Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentAdmissions && recentAdmissions.length > 0 ? (
                recentAdmissions.map((patient) => (
                  <tr key={patient._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-teal-700">
                      {patient.patientId}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {patient.fullName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{patient.department}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {patient.assignedDoctor?.fullName || 'Not assigned'}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(patient.admissionDate)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={patient.status} size="xs" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/patients/${patient._id}`}
                        className="inline-flex items-center px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold transition"
                      >
                        Clinical Record
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                    No recent admissions recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
