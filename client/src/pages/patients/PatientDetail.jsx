import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  CheckCircle,
  AlertTriangle,
  HeartPulse,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Clock,
  Bed,
  User,
  Activity,
  FileText,
  Pill,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { patientApi } from '../../api/patientApi';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { PageLoader } from '../../components/common/Loader';
import { formatDate, formatDateTime, calculateAge } from '../../utils/formatters';

export const PatientDetail = () => {
  const { id } = useParams();
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fast Discharge Modal
  const [dischargeModalOpen, setDischargeModalOpen] = useState(false);
  const [isDischarging, setIsDischarging] = useState(false);

  const fetchPatientDetail = async () => {
    try {
      setLoading(true);
      const res = await patientApi.getPatientById(id);
      if (res.success) {
        setPatient(res.data);
      }
    } catch (err) {
      console.error('Error fetching patient record:', err);
      toast.error('Failed to load patient clinical file');
      navigate('/patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientDetail();
  }, [id]);

  const handleDischargeConfirm = async () => {
    try {
      setIsDischarging(true);
      const res = await patientApi.dischargePatient(id);
      if (res.success) {
        toast.success(`Patient ${patient.fullName} has been officially discharged`);
        setPatient(res.data);
        setDischargeModalOpen(false);
      }
    } catch (err) {
      console.error('Error discharging patient:', err);
      toast.error(err.response?.data?.message || 'Failed to discharge patient');
    } finally {
      setIsDischarging(false);
    }
  };

  if (loading) {
    return <PageLoader message="Retrieving patient clinical chart..." />;
  }

  if (!patient) {
    return null;
  }

  const isDischarged = patient.status === 'Discharged';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/patients"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {patient.fullName}
              </h1>
              <StatusBadge status={patient.status} size="sm" />
              <StatusBadge status={patient.patientType} size="sm" showDot={false} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              MRN / Patient ID: <span className="font-mono font-semibold text-teal-700">{patient.patientId}</span> • Blood Group: <span className="font-semibold text-rose-600">{patient.bloodGroup}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {!isDischarged && (
            <button
              onClick={() => setDischargeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Discharge Patient</span>
            </button>
          )}

          <Link
            to={`/patients/${patient._id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Record</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Clinical Status & Doctor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Clinical Case & Treatment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary Diagnosis Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                Primary Diagnosis & Symptoms
              </h2>
              <span className="text-xs font-mono font-semibold text-slate-400">ICD Clinical Summary</span>
            </div>

            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100">
              <p className="text-xs font-semibold text-teal-800 uppercase tracking-wide">
                Diagnosed Condition
              </p>
              <p className="text-base font-bold text-slate-900 mt-1">
                {patient.diagnosis}
              </p>
            </div>

            {patient.symptoms && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Reported / Observed Symptoms
                </p>
                <p className="text-sm text-slate-700 mt-1 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                  {patient.symptoms}
                </p>
              </div>
            )}

            {/* Allergies Alert Box */}
            {patient.allergies ? (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                    Known Patient Allergies
                  </p>
                  <p className="text-sm font-semibold text-rose-700 mt-0.5">
                    {patient.allergies}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>No known drug or food allergies on record</span>
              </div>
            )}
          </div>

          {/* Medical History & Current Medications */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Pill className="w-4 h-4 text-cyan-600" />
              Pharmacotherapy & Medical History
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <p className="font-semibold text-slate-500 uppercase tracking-wider">
                  Current Inpatient / Outpatient Medications
                </p>
                <p className="text-sm text-slate-800 mt-1 bg-slate-50 p-3.5 rounded-lg border border-slate-100 font-mono">
                  {patient.currentMedications || 'None currently prescribed.'}
                </p>
              </div>

              <div>
                <p className="font-semibold text-slate-500 uppercase tracking-wider">
                  Past Medical & Surgical History
                </p>
                <p className="text-sm text-slate-700 mt-1 bg-slate-50 p-3.5 rounded-lg border border-slate-100 leading-relaxed">
                  {patient.medicalHistory || 'No prior medical history noted.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Assigned Doctor, Location, Contacts, Insurance */}
        <div className="space-y-6">
          {/* Attending Physician Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-cyan-600" />
              <span>Attending Physician</span>
            </h3>

            {patient.assignedDoctor ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-sm">
                    {patient.assignedDoctor.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">
                      {patient.assignedDoctor.fullName}
                    </p>
                    <p className="text-xs text-teal-600 font-medium">
                      {patient.assignedDoctor.department}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 pt-2 border-t border-slate-100 space-y-1">
                  {patient.assignedDoctor.specialization && (
                    <p className="text-slate-500 font-medium">
                      Spec: {patient.assignedDoctor.specialization}
                    </p>
                  )}
                  {patient.assignedDoctor.phone && (
                    <p className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{patient.assignedDoctor.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No doctor assigned yet.</p>
            )}
          </div>

          {/* Admission & Bed Location Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Bed className="w-4 h-4 text-teal-600" />
              <span>Ward & Census Location</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-semibold text-slate-800">{patient.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ward Unit:</span>
                <span className="font-semibold text-slate-800">{patient.wardNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bed / Room:</span>
                <span className="font-semibold text-slate-800">{patient.roomNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="text-slate-400">Admission Date:</span>
                <span className="font-medium text-slate-700">{formatDate(patient.admissionDate)}</span>
              </div>
              {patient.dischargeDate && (
                <div className="flex justify-between">
                  <span className="text-emerald-600 font-semibold">Discharge Date:</span>
                  <span className="font-semibold text-emerald-700">
                    {formatDate(patient.dischargeDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Demographics & Emergency Contact */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              <span>Patient Contact & Emergency</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Age & Gender:</span>
                <span className="font-semibold text-slate-800">
                  {calculateAge(patient.dateOfBirth)} yrs ({patient.gender})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient Phone:</span>
                <span className="font-semibold text-slate-800">{patient.phone}</span>
              </div>
              {patient.email && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-slate-700 truncate max-w-[150px]">{patient.email}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Emergency Contact</p>
                <p className="font-bold text-slate-800 mt-0.5">{patient.emergencyContactName}</p>
                <p className="text-slate-600 font-medium">{patient.emergencyContactPhone}</p>
              </div>
            </div>
          </div>

          {/* Insurance Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Insurance Coverage</span>
            </h3>

            <div className="text-xs space-y-1.5">
              <p className="font-semibold text-slate-800">
                {patient.insuranceProvider || 'Self-pay / Uninsured'}
              </p>
              {patient.insurancePolicyNumber && (
                <p className="font-mono text-slate-500">
                  Policy #: {patient.insurancePolicyNumber}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Discharge Confirmation Modal */}
      <Modal
        isOpen={dischargeModalOpen}
        onClose={() => setDischargeModalOpen(false)}
        title="Confirm Discharge"
        confirmText="Discharge Patient"
        confirmVariant="emerald"
        isLoading={isDischarging}
        onConfirm={handleDischargeConfirm}
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to officially discharge{' '}
          <span className="font-semibold text-slate-900">{patient.fullName}</span>?
          This will stamp today's date ({formatDate(new Date())}) as the release date.
        </p>
      </Modal>
    </div>
  );
};

export default PatientDetail;
