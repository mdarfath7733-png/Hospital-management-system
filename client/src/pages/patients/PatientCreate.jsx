import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Stethoscope, AlertCircle, HeartPulse, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { patientApi } from '../../api/patientApi';
import { staffApi } from '../../api/staffApi';
import FormInput from '../../components/common/FormInput';
import { PageLoader } from '../../components/common/Loader';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
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

export const PatientCreate = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Male',
    dateOfBirth: '',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    patientType: 'Inpatient',
    admissionDate: new Date().toISOString().split('T')[0],
    assignedDoctor: '',
    department: 'Cardiology',
    wardNumber: '',
    roomNumber: '',
    diagnosis: '',
    symptoms: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    status: 'Admitted',
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const res = await staffApi.getDoctors();
        if (res.success && res.data) {
          setDoctors(res.data);
          if (res.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              assignedDoctor: res.data[0]._id,
              department: res.data[0].department || 'Cardiology',
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        toast.error('Could not load doctor list for assignment');
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // When doctor is changed, auto-suggest their department if available
      if (name === 'assignedDoctor') {
        const found = doctors.find((d) => d._id === value);
        if (found && found.department) {
          updated.department = found.department;
        }
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Patient full name is required';
    if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.address.trim()) errs.address = 'Residential address is required';
    if (!formData.emergencyContactName.trim()) {
      errs.emergencyContactName = 'Emergency contact name is required';
    }
    if (!formData.emergencyContactPhone.trim()) {
      errs.emergencyContactPhone = 'Emergency contact phone is required';
    }
    if (!formData.assignedDoctor) errs.assignedDoctor = 'Please assign an attending doctor';
    if (!formData.department) errs.department = 'Department is required';
    if (!formData.diagnosis.trim()) errs.diagnosis = 'Preliminary clinical diagnosis is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please complete all required fields correctly');
      return;
    }

    try {
      setSubmitting(true);
      const res = await patientApi.createPatient(formData);
      if (res.success) {
        toast.success(`Patient ${res.data.fullName} admitted successfully with ID ${res.data.patientId}`);
        navigate(`/patients/${res.data._id}`);
      }
    } catch (err) {
      console.error('Error admitting patient:', err);
      const msg = err.response?.data?.message || 'Failed to admit patient';
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

  if (loadingDoctors) {
    return <PageLoader message="Loading hospital departments & clinicians..." />;
  }

  const doctorOptions = doctors.map((doc) => ({
    value: doc._id,
    label: `${doc.fullName} (${doc.department}${doc.specialization ? ` - ${doc.specialization}` : ''})`,
  }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/patients"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Admission</h1>
            <p className="text-xs text-slate-500">Register new inpatient or outpatient clinical record</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Demographics */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            1. Patient Demographics & Identification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Patient Full Name"
              name="fullName"
              placeholder="e.g. John Doe"
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
              label="Blood Group"
              name="bloodGroup"
              type="select"
              required
              value={formData.bloodGroup}
              onChange={handleChange}
              options={BLOOD_GROUPS}
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
              label="Email Address"
              name="email"
              type="email"
              placeholder="patient@example.com (optional)"
              value={formData.email}
              onChange={handleChange}
            />

            <FormInput
              label="Residential Address"
              name="address"
              placeholder="Full address with city, state"
              required
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              className="md:col-span-2"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            2. Emergency Contact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Contact Person Name & Relation"
              name="emergencyContactName"
              placeholder="e.g. Mary Doe (Spouse)"
              required
              value={formData.emergencyContactName}
              onChange={handleChange}
              error={errors.emergencyContactName}
            />

            <FormInput
              label="Emergency Telephone"
              name="emergencyContactPhone"
              placeholder="+1 (555) 999-8888"
              required
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              error={errors.emergencyContactPhone}
            />
          </div>
        </div>

        {/* Admission & Clinical Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            3. Admission & Clinical Record
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Care Type"
              name="patientType"
              type="select"
              required
              value={formData.patientType}
              onChange={handleChange}
              options={['Inpatient', 'Outpatient']}
            />

            <FormInput
              label="Admission Date"
              name="admissionDate"
              type="date"
              required
              value={formData.admissionDate}
              onChange={handleChange}
            />

            <FormInput
              label="Initial Status"
              name="status"
              type="select"
              required
              value={formData.status}
              onChange={handleChange}
              options={['Admitted', 'Under Treatment', 'Critical']}
            />

            <FormInput
              label="Attending Doctor"
              name="assignedDoctor"
              type="select"
              required
              value={formData.assignedDoctor}
              onChange={handleChange}
              options={doctorOptions}
              error={errors.assignedDoctor}
              className="md:col-span-2"
            />

            <FormInput
              label="Department"
              name="department"
              type="select"
              required
              value={formData.department}
              onChange={handleChange}
              options={DEPARTMENTS}
              error={errors.department}
            />

            <FormInput
              label="Ward / Unit Name"
              name="wardNumber"
              placeholder="e.g. Cardio Ward 3"
              value={formData.wardNumber}
              onChange={handleChange}
            />

            <FormInput
              label="Room / Bed Number"
              name="roomNumber"
              placeholder="e.g. CW-302"
              value={formData.roomNumber}
              onChange={handleChange}
            />

            <FormInput
              label="Primary Clinical Diagnosis"
              name="diagnosis"
              placeholder="e.g. Acute Coronary Syndrome, Unstable Angina"
              required
              value={formData.diagnosis}
              onChange={handleChange}
              error={errors.diagnosis}
              className="md:col-span-3"
            />

            <FormInput
              label="Presenting Symptoms"
              name="symptoms"
              type="textarea"
              placeholder="Describe symptoms observed or reported upon admission..."
              value={formData.symptoms}
              onChange={handleChange}
              className="md:col-span-3"
            />

            <FormInput
              label="Medical & Surgical History"
              name="medicalHistory"
              type="textarea"
              placeholder="Pre-existing conditions, prior surgeries, chronic illnesses..."
              value={formData.medicalHistory}
              onChange={handleChange}
              className="md:col-span-3"
            />

            <FormInput
              label="Known Allergies (Food / Drug)"
              name="allergies"
              placeholder="e.g. Penicillin, Sulfa, Latex (leave empty if none known)"
              value={formData.allergies}
              onChange={handleChange}
              className="md:col-span-3"
            />

            <FormInput
              label="Current Medications & Dosages"
              name="currentMedications"
              placeholder="e.g. Atorvastatin 40mg daily, Metoprolol 25mg"
              value={formData.currentMedications}
              onChange={handleChange}
              className="md:col-span-3"
            />
          </div>
        </div>

        {/* Insurance Coverage */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            4. Insurance Coverage (Optional)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Insurance Provider"
              name="insuranceProvider"
              placeholder="e.g. Blue Cross Blue Shield, Aetna, Medicare"
              value={formData.insuranceProvider}
              onChange={handleChange}
            />

            <FormInput
              label="Policy / Member ID Number"
              name="insurancePolicyNumber"
              placeholder="e.g. BCBS-9842104"
              value={formData.insurancePolicyNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/patients"
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
                <span>Complete Admission</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientCreate;
