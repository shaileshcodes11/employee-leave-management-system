import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import EmployeeDashboard from './pages/EmployeeDashboard'
import ApplyLeave from './pages/ApplyLeave'
import LeaveHistory from './pages/LeaveHistory'
import ManagerDashboard from './pages/ManagerDashboard'
import LeaveRequests from './pages/LeaveRequests'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function HomeRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return (
    <Navigate to={user.role === 'MANAGER' ? '/manager/dashboard' : '/employee/dashboard'} replace />
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />

      {/* Employee routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRole="EMPLOYEE">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/apply-leave"
        element={
          <ProtectedRoute allowedRole="EMPLOYEE">
            <ApplyLeave />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/history"
        element={
          <ProtectedRoute allowedRole="EMPLOYEE">
            <LeaveHistory />
          </ProtectedRoute>
        }
      />

      {/* Manager routes */}
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute allowedRole="MANAGER">
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/requests"
        element={
          <ProtectedRoute allowedRole="MANAGER">
            <LeaveRequests />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
