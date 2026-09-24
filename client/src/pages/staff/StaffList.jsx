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
  Stethoscope,
  Phone,
  Mail,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { staffApi } from '../../api/staffApi';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { formatCurrency } from '../../utils/formatters';

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

const STATUSES = ['Active', 'On Leave', 'Resigned'];

export const StaffList = () => {
  const { hasRole } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStaff = async (pageNum = page) => {
    try {
      setLoading(true);
      const params = {
        page: pageNum,
        limit: 10,
      };
      if (search.trim()) params.search = search.trim();
      if (selectedRole) params.role = selectedRole;
      if (selectedDept) params.department = selectedDept;
      if (selectedStatus) params.status = selectedStatus;

      const res = await staffApi.getStaff(params);
      if (res.success) {
        setStaffList(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
        setPage(res.currentPage);
      }
    } catch (err) {
      console.error('Error fetching staff list:', err);
      toast.error('Failed to load hospital staff directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff(1);
  }, [selectedRole, selectedDept, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStaff(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedRole('');
    setSelectedDept('');
    setSelectedStatus('');
  };

  const openDeleteModal = (staff) => {
    setStaffToDelete(staff);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!staffToDelete) return;
    try {
      setIsDeleting(true);
      await staffApi.deleteStaff(staffToDelete._id);
      toast.success(`Staff member ${staffToDelete.fullName} deleted successfully`);
      setDeleteModalOpen(false);
      setStaffToDelete(null);
      fetchStaff(page);
    } catch (err) {
      console.error('Failed to delete staff:', err);
      toast.error(err.response?.data?.message || 'Failed to delete staff member');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Staff ID',
      key: 'staffId',
      render: (item) => (
        <span className="font-mono font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-xs">
          {item.staffId}
        </span>
      ),
    },
    {
      header: 'Staff Member',
      key: 'fullName',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs uppercase border border-slate-200">
            {item.fullName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 leading-snug">{item.fullName}</p>
            <p className="text-xs text-slate-400">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role & Dept',
      key: 'role',
      render: (item) => (
        <div>
          <StatusBadge status={item.role} size="xs" showDot={false} />
          <p className="text-xs text-slate-500 mt-1 font-medium">{item.department}</p>
        </div>
      ),
    },
    {
      header: 'Contact',
      key: 'phone',
      render: (item) => (
        <div className="text-xs text-slate-600">
          <p className="font-medium">{item.phone}</p>
          <p className="text-slate-400 capitalize">{item.shift} Shift</p>
        </div>
      ),
    },
    {
      header: 'Salary',
      key: 'salary',
      render: (item) => (
        <span className="text-xs font-semibold text-slate-700">
          {formatCurrency(item.salary)}/yr
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
            to={`/staff/${item._id}`}
            title="View Details"
            className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {hasRole('admin') && (
            <>
              <Link
                to={`/staff/${item._id}/edit`}
                title="Edit Staff"
                className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={() => openDeleteModal(item)}
                title="Delete Staff"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage hospital clinicians, nursing personnel, and administrative staff
          </p>
        </div>

        {hasRole('admin') && (
          <Link
            to="/staff/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard New Staff</span>
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
              placeholder="Search staff by name, staff ID, email, phone, or specialty..."
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
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:border-teal-500"
          >
            <option value="">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
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

          {(search || selectedRole || selectedDept || selectedStatus) && (
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

      {/* Staff Table */}
      <DataTable
        columns={columns}
        data={staffList}
        isLoading={loading}
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={(newPage) => fetchStaff(newPage)}
        emptyMessage="No staff members match the selected filters."
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Staff Record Removal"
        confirmText="Delete Staff"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to remove staff member{' '}
          <span className="font-semibold text-slate-800">
            {staffToDelete?.fullName} ({staffToDelete?.staffId})
          </span>
          ? This action will permanently remove their employment profile.
        </p>
      </Modal>
    </div>
  );
};

export default StaffList;
