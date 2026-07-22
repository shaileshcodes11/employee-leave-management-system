import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Wraps a page and:
 *  - redirects to /login if there is no logged-in user
 *  - optionally restricts access to a specific role (employee/manager)
 */
export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    // Logged in, but wrong role for this page - send them to their own dashboard
    const fallback = user.role === 'MANAGER' ? '/manager/dashboard' : '/employee/dashboard'
    return <Navigate to={fallback} replace />
  }

  return children
}
