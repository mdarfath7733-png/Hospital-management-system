import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, UserCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { staffApi } from '../../api/staffApi';
import FormInput from '../../components/common/FormInput';

const ROLES = [
  'Doctor',
  'Nurse',
  'Receptionist',
  'Lab Technician',
  'Pharmacist',
  'Admin',
  'Other',
];

const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'General Medicine',
  'Surgery',
  'Emergency',
  'Radiology',
  'Other',
];

export const StaffCreate = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Male',
    dateOfBirth: '',
    role: 'Doctor',
    department: 'Cardiology',
    specialization: '',
    qualification: '',
    phone: '',
    email: '',
    address: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
    shift: 'Morning',
    salary: '',
    status: 'Active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    if (!formData.qualification.trim()) errs.qualification = 'Qualification is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    if (!formData.address.trim()) errs.address = 'Address is required';
    if (!formData.salary || Number(formData.salary) < 0) {
      errs.salary = 'Valid non-negative salary is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix validation errors before submitting');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        salary: Number(formData.salary),
      };
      const res = await staffApi.createStaff(payload);
      if (res.success) {
        toast.success(`Staff member ${res.data.fullName} registered with ID ${res.data.staffId}`);
        navigate(`/staff/${res.data._id}`);
      }
    } catch (err) {
      console.error('Error creating staff:', err);
      const msg = err.response?.data?.message || 'Failed to create staff member';
      toast.error(msg);
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/staff"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Onboard Staff</h1>
            <p className="text-xs text-slate-500">Register new hospital personnel into the system</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            Personal & Demographic Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Full Legal Name"
              name="fullName"
              placeholder="e.g. Dr. Robert Martinez"
              required
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              className="md:col-span-2"
            />

            <FormInput
              label="Gender"
              name="gender"
              type="select"
              required
              value={formData.gender}
              onChange={handleChange}
              options={['Male', 'Female', 'Other']}
            />

            <FormInput
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
            />

            <FormInput
              label="Phone Number"
              name="phone"
              placeholder="+1 (555) 000-0000"
              required
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />

            <FormInput
              label="Official Email"
              name="email"
              type="email"
              placeholder="doctor@hospital.com"
              required
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <FormInput
              label="Residential Address"
              name="address"
              placeholder="Street address, City, State"
              required
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              className="md:col-span-3"
            />
          </div>
        </div>

        {/* Professional & Position Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            Role & Hospital Department
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Designation / Role"
              name="role"
              type="select"
              required
              value={formData.role}
              onChange={handleChange}
              options={ROLES}
            />

            <FormInput
              label="Department"
              name="department"
              type="select"
              required
              value={formData.department}
              onChange={handleChange}
              options={DEPARTMENTS}
            />

            <FormInput
              label="Clinical Specialization"
              name="specialization"
              placeholder="e.g. Pediatric Surgery, Trauma"
              value={formData.specialization}
              onChange={handleChange}
              helperText="Optional for non-clinical roles"
            />

            <FormInput
              label="Qualifications & Credentials"
              name="qualification"
              placeholder="e.g. MD, MBBS, BSN RN"
              required
              value={formData.qualification}
              onChange={handleChange}
              error={errors.qualification}
              className="md:col-span-2"
            />

            <FormInput
              label="Work Shift"
              name="shift"
              type="select"
              required
              value={formData.shift}
              onChange={handleChange}
              options={['Morning', 'Evening', 'Night']}
            />

            <FormInput
              label="Date of Joining"
              name="dateOfJoining"
              type="date"
              required
              value={formData.dateOfJoining}
              onChange={handleChange}
            />

            <FormInput
              label="Annual Salary ($)"
              name="salary"
              type="number"
              min="0"
              placeholder="e.g. 120000"
              required
              value={formData.salary}
              onChange={handleChange}
              error={errors.salary}
            />

            <FormInput
              label="Employment Status"
              name="status"
              type="select"
              required
              value={formData.status}
              onChange={handleChange}
              options={['Active', 'On Leave', 'Resigned']}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/staff"
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Staff Record</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffCreate;
