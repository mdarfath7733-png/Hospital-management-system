import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Clock,
  DollarSign,
  ShieldCheck,
  Stethoscope,
  Briefcase,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { staffApi } from '../../api/staffApi';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import { PageLoader } from '../../components/common/Loader';
import { formatDate, formatCurrency, calculateAge } from '../../utils/formatters';

export const StaffDetail = () => {
  const { id } = useParams();
  const { hasRole } = useAuth();
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffDetail = async () => {
      try {
        setLoading(true);
        const res = await staffApi.getStaffById(id);
        if (res.success) {
          setStaff(res.data);
        }
      } catch (err) {
        console.error('Error fetching staff member:', err);
        toast.error('Failed to load staff profile');
        navigate('/staff');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffDetail();
  }, [id, navigate]);

  if (loading) {
    return <PageLoader message="Loading staff member details..." />;
  }

  if (!staff) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/staff"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {staff.fullName}
              </h1>
              <StatusBadge status={staff.status} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Staff ID: <span className="font-mono font-semibold text-teal-700">{staff.staffId}</span> • Joined {formatDate(staff.dateOfJoining)}
            </p>
          </div>
        </div>

        {hasRole('admin') && (
          <Link
            to={`/staff/${staff._id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
        )}
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Summary Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-600 text-white flex items-center justify-center text-3xl font-bold shadow-md shadow-teal-500/20 mb-4">
            {staff.fullName.charAt(0)}
          </div>
          <h2 className="text-lg font-bold text-slate-900">{staff.fullName}</h2>
          <p className="text-xs font-semibold text-teal-600 mt-0.5">{staff.role}</p>
          <p className="text-xs text-slate-400 mt-0.5">{staff.department}</p>

          <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3 text-left text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Gender & Age</span>
              <span className="font-semibold text-slate-700">
                {staff.gender}, {calculateAge(staff.dateOfBirth)} yrs
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Shift</span>
              <span className="font-semibold text-slate-700">{staff.shift} Shift</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Annual Salary</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(staff.salary)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Professional Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Professional Credentials Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-600" />
              <span>Professional Qualifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Degree & Licenses</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{staff.qualification}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Specialization</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {staff.specialization || 'General Practice'}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-teal-600" />
              <span>Contact & Residential Details</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <Phone className="w-4 h-4 text-teal-600 mt-0.5" />
                <div>
                  <p className="text-slate-400 font-medium">Telephone Number</p>
                  <p className="text-sm font-semibold text-slate-800">{staff.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <Mail className="w-4 h-4 text-teal-600 mt-0.5" />
                <div>
                  <p className="text-slate-400 font-medium">Official Email Address</p>
                  <p className="text-sm font-semibold text-slate-800">{staff.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <MapPin className="w-4 h-4 text-teal-600 mt-0.5" />
                <div>
                  <p className="text-slate-400 font-medium">Physical Home Address</p>
                  <p className="text-sm font-semibold text-slate-800">{staff.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;
