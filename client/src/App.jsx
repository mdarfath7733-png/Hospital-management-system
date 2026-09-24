import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Staff Pages
import StaffList from './pages/staff/StaffList';
import StaffCreate from './pages/staff/StaffCreate';
import StaffDetail from './pages/staff/StaffDetail';
import StaffEdit from './pages/staff/StaffEdit';

// Patient Pages
import PatientList from './pages/patients/PatientList';
import PatientCreate from './pages/patients/PatientCreate';
import PatientDetail from './pages/patients/PatientDetail';
import PatientEdit from './pages/patients/PatientEdit';

// Redirect authenticated users away from /login
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

export const App = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Layout Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard & Profile */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />

        {/* Staff Management (Admin only) */}
        <Route
          path="staff"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StaffList />
            </ProtectedRoute>
          }
        />
        <Route
          path="staff/new"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StaffCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="staff/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StaffDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="staff/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StaffEdit />
            </ProtectedRoute>
          }
        />

        {/* Patient Management */}
        <Route
          path="patients"
          element={
            <ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']}>
              <PatientList />
            </ProtectedRoute>
          }
        />
        <Route
          path="patients/new"
          element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              <PatientCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="patients/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']}>
              <PatientDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="patients/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']}>
              <PatientEdit />
            </ProtectedRoute>
          }
        />

        {/* 404 inside layout */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
