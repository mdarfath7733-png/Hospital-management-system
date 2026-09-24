import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { patientApi } from '../../api/patientApi';
import { staffApi } from '../../api/staffApi';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { formatDate, calculateAge } from '../../utils/formatters';

const STATUSES = ['Admitted', 'Under Treatment', 'Discharged', 'Critical'];
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

export const PatientList = () => {
  const { user, hasRole } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  // Fast Discharge Modal
  const [dischargeModalOpen, setDischargeModalOpen] = useState(false);
  const [patientToDischarge, setPatientToDischarge] = useState(null);
  const [isDischarging, setIsDischarging] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPatients = async (pageNum = page) => {
    try {
      setLoading(true);
      const params = {
        page: pageNum,
        limit: 10,
      };
      if (search.trim()) params.search = search.trim();
      if (selectedStatus) params.status = selectedStatus;
      if (selectedDept) params.department = selectedDept;

      const res = await patientApi.getPatients(params);
      if (res.success) {
        setPatients(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
        setPage(res.currentPage);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      toast.error('Failed to load patient registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(1);
  }, [selectedStatus, selectedDept]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPatients(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedStatus('');
    setSelectedDept('');
  };

  // Discharge Handlers
  const openDischargeModal = (patient) => {
    setPatientToDischarge(patient);
    setDischargeModalOpen(true);
  };

  const handleDischargeConfirm = async () => {
    if (!patientToDischarge) return;
    try {
      setIsDischarging(true);
      const res = await patientApi.dischargePatient(patientToDischarge._id);
      if (res.success) {
        toast.success(`Patient ${patientToDischarge.fullName} successfully discharged`);
        setDischargeModalOpen(false);
        setPatientToDischarge(null);
        fetchPatients(page);
      }
    } catch (err) {
      console.error('Error discharging patient:', err);
      toast.error(err.response?.data?.message || 'Failed to discharge patient');
    } finally {
      setIsDischarging(false);
    }
  };

  // Delete Handlers
  const openDeleteModal = (patient) => {
    setPatientToDelete(patient);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;
    try {
      setIsDeleting(true);
      await patientApi.deletePatient(patientToDelete._id);
      toast.success(`Patient record ${patientToDelete.patientId} removed`);
      setDeleteModalOpen(false);
      setPatientToDelete(null);
      fetchPatients(page);
    } catch (err) {
      console.error('Failed to delete patient:', err);
      toast.error(err.response?.data?.message || 'Failed to delete patient record');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Patient ID',
      key: 'patientId',
      render: (item) => (
        <span className="font-mono font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-xs">
          {item.patientId}
        </span>
      ),
    },
    {
      header: 'Patient Details',
      key: 'fullName',
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-900 leading-snug">{item.fullName}</p>
          <p className="text-xs text-slate-400">
            {item.gender}, {calculateAge(item.dateOfBirth)} yrs • {item.bloodGroup}
          </p>
        </div>
      ),
    },
    {
      header: 'Department & Doctor',
      key: 'department',
      render: (item) => (
        <div>
          <p className="text-xs font-semibold text-slate-700">{item.department}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <Stethoscope className="w-3 h-3 text-cyan-600" />
            <span>{item.assignedDoctor?.fullName || 'Not assigned'}</span>
          </p>
        </div>
      ),
    },
    {
      header: 'Type & Ward',
      key: 'patientType',
      render: (item) => (
        <div>
          <StatusBadge status={item.patientType} size="xs" showDot={false} />
          {item.wardNumber && (
            <p className="text-[11px] text-slate-400 mt-1 font-mono">{item.wardNumber}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Admitted Date',
      key: 'admissionDate',
      render: (item) => (
        <span className="text-xs text-slate-600 font-medium">
          {formatDate(item.admissionDate)}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (item) => <StatusBadge status={item.status} size="xs" />,
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            to={`/patients/${item._id}`}
            title="View Clinical Profile"
            className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
          >
            <Eye className="w-4 h-4" />
          </Link>

          <Link
            to={`/patients/${item._id}/edit`}
            title="Edit Details"
            className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
          >
            <Edit className="w-4 h-4" />
          </Link>

          {item.status !== 'Discharged' && (
            <button
              onClick={() => openDischargeModal(item)}
              title="Fast Discharge"
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}

          {hasRole('admin') && (
            <button
              onClick={() => openDeleteModal(item)}
              title="Delete Record"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patients Registry</h1>
          <p className="text-xs text-slate-500 mt-1">
            Clinical inpatient admission, diagnostic history, and outpatient care tracking
          </p>
        </div>

        {(hasRole('admin') || hasRole('receptionist')) && (
          <Link
            to="/patients/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Admit New Patient</span>
          </Link>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients by name, Patient ID, phone number, or diagnosis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Filter by:</span>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:border-teal-500"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:border-teal-500"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {(search || selectedStatus || selectedDept) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Patients Table */}
      <DataTable
        columns={columns}
        data={patients}
        isLoading={loading}
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={(newPage) => fetchPatients(newPage)}
        emptyMessage="No patient records match the search or filter criteria."
      />

      {/* Fast Discharge Confirmation Modal */}
      <Modal
        isOpen={dischargeModalOpen}
        onClose={() => setDischargeModalOpen(false)}
        title="Discharge Patient"
        confirmText="Confirm Discharge"
        confirmVariant="emerald"
        isLoading={isDischarging}
        onConfirm={handleDischargeConfirm}
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Are you sure you want to mark patient{' '}
            <span className="font-semibold text-slate-800">
              {patientToDischarge?.fullName} ({patientToDischarge?.patientId})
            </span>{' '}
            as <span className="text-emerald-700 font-semibold">Discharged</span>?
          </p>
          <p className="text-xs text-slate-400">
            This will stamp the official discharge timestamp and update the hospital ward census.
          </p>
        </div>
      </Modal>

      {/* Delete Patient Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Patient Record"
        confirmText="Delete Record"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to permanently delete medical record for{' '}
          <span className="font-semibold text-slate-800">
            {patientToDelete?.fullName} ({patientToDelete?.patientId})
          </span>
          ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default PatientList;
