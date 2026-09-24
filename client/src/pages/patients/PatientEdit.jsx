import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import { patientApi } from '../../api/patientApi';
import { staffApi } from '../../api/staffApi';
import { useAuth } from '../../context/AuthContext';
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

export const PatientEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor';

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [doctors, setDoctors] = useState([]);
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
    admissionDate: '',
    dischargeDate: '',
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
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientRes, doctorsRes] = await Promise.all([
          patientApi.getPatientById(id),
          staffApi.getDoctors(),
        ]);

        if (doctorsRes.success) {
          setDoctors(doctorsRes.data);
        }

        if (patientRes.success) {
          const p = patientRes.data;
          setFormData({
            fullName: p.fullName || '',
            gender: p.gender || 'Male',
            dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '',
            bloodGroup: p.bloodGroup || 'O+',
            phone: p.phone || '',
            email: p.email || '',
            address: p.address || '',
            emergencyContactName: p.emergencyContactName || '',
            emergencyContactPhone: p.emergencyContactPhone || '',
            patientType: p.patientType || 'Inpatient',
            admissionDate: p.admissionDate ? p.admissionDate.split('T')[0] : '',
            dischargeDate: p.dischargeDate ? p.dischargeDate.split('T')[0] : '',
            assignedDoctor: p.assignedDoctor?._id || p.assignedDoctor || '',
            department: p.department || 'Cardiology',
            wardNumber: p.wardNumber || '',
            roomNumber: p.roomNumber || '',
            diagnosis: p.diagnosis || '',
            symptoms: p.symptoms || '',
            medicalHistory: p.medicalHistory || '',
            allergies: p.allergies || '',
            currentMedications: p.currentMedications || '',
            insuranceProvider: p.insuranceProvider || '',
            insurancePolicyNumber: p.insurancePolicyNumber || '',
            status: p.status || 'Admitted',
          });
        }
      } catch (err) {
        console.error('Error fetching data for edit:', err);
        toast.error('Failed to load patient record');
        navigate('/patients');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!isDoctor) {
      if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
      if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
      if (!formData.phone.trim()) errs.phone = 'Phone number is required';
      if (!formData.emergencyContactName.trim()) {
        errs.emergencyContactName = 'Emergency contact is required';
      }
      if (!formData.assignedDoctor) errs.assignedDoctor = 'Doctor is required';
    }
    if (!formData.diagnosis.trim()) errs.diagnosis = 'Diagnosis is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix errors before saving');
      return;
    }

    try {
      setSubmitting(true);
      const res = await patientApi.updatePatient(id, formData);
      if (res.success) {
        toast.success(`Patient record updated successfully`);
        navigate(`/patients/${id}`);
      }
    } catch (err) {
      console.error('Error updating patient:', err);
      const msg = err.response?.data?.message || 'Failed to update patient record';
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

  if (loading) {
    return <PageLoader message="Loading patient clinical chart for editing..." />;
  }

  const doctorOptions = doctors.map((doc) => ({
    value: doc._id,
    label: `${doc.fullName} (${doc.department})`,
  }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/patients/${id}`}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Edit Patient Record
            </h1>
            <p className="text-xs text-slate-500">
              {isDoctor
                ? 'Doctor view: Update clinical notes, diagnoses, medications, and care status'
                : 'Full patient registry modification'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Clinical Notes (Always editable) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            Clinical Notes & Diagnosis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Primary Clinical Diagnosis"
              name="diagnosis"
              required
              value={formData.diagnosis}
              onChange={handleChange}
              error={errors.diagnosis}
              className="md:col-span-2"
            />

            <FormInput
              label="Presenting Symptoms"
              name="symptoms"
              type="textarea"
              value={formData.symptoms}
              onChange={handleChange}
              className="md:col-span-2"
            />

            <FormInput
              label="Known Allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="md:col-span-2"
            />

            <FormInput
              label="Current Medications & Dosages"
              name="currentMedications"
              type="textarea"
              value={formData.currentMedications}
              onChange={handleChange}
              className="md:col-span-2"
            />

            <FormInput
              label="Past Medical History"
              name="medicalHistory"
              type="textarea"
              value={formData.medicalHistory}
              onChange={handleChange}
              className="md:col-span-2"
            />

            <FormInput
              label="Patient Status"
              name="status"
              type="select"
              required
              value={formData.status}
              onChange={handleChange}
              options={['Admitted', 'Under Treatment', 'Discharged', 'Critical']}
            />

            {formData.status === 'Discharged' && (
              <FormInput
                label="Discharge Date"
                name="dischargeDate"
                type="date"
                value={formData.dischargeDate}
                onChange={handleChange}
              />
            )}
          </div>
        </div>

        {/* Demographics & Admission (Non-Doctor only or disabled for doctor) */}
        {!isDoctor && (
          <>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                Demographics & Admission Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Full Name"
                  name="fullName"
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
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />

                <FormInput
                  label="Residential Address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="md:col-span-3"
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
                />

                <FormInput
                  label="Ward Unit"
                  name="wardNumber"
                  value={formData.wardNumber}
                  onChange={handleChange}
                />

                <FormInput
                  label="Room / Bed"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                />

                <FormInput
                  label="Care Type"
                  name="patientType"
                  type="select"
                  required
                  value={formData.patientType}
                  onChange={handleChange}
                  options={['Inpatient', 'Outpatient']}
                />
              </div>
            </div>

            {/* Emergency Contact & Insurance */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Emergency & Insurance Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Emergency Contact Name"
                  name="emergencyContactName"
                  required
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  error={errors.emergencyContactName}
                />

                <FormInput
                  label="Emergency Contact Phone"
                  name="emergencyContactPhone"
                  required
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  error={errors.emergencyContactPhone}
                />

                <FormInput
                  label="Insurance Provider"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                />

                <FormInput
                  label="Policy Number"
                  name="insurancePolicyNumber"
                  value={formData.insurancePolicyNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to={`/patients/${id}`}
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
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientEdit;
