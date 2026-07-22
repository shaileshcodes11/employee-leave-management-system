import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isManager } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link
          className="navbar-brand fw-semibold"
          to={isManager ? '/manager/dashboard' : '/employee/dashboard'}
        >
          Leave Management
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto">
            {isManager ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/manager/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/manager/requests">Leave Requests</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/employee/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/employee/apply-leave">Apply Leave</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/employee/history">History</Link>
                </li>
              </>
            )}
          </ul>

          {user && (
            <div className="d-flex align-items-center gap-3">
              <span className="text-light small">
                Hi, {user.first_name || user.username}
                <span className="badge bg-secondary ms-2">{user.role}</span>
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
