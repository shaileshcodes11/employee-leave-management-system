import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Layout from '../components/Layout'
import DashboardCard from '../components/DashboardCard'
import { useAuth } from '../context/AuthContext'

export default function ManagerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/manager/')
        setStats(data)
      } catch (err) {
        setError('Could not load dashboard data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <Layout>
      <h3 className="mb-1">Welcome, {user?.first_name || user?.username} 👋</h3>
      <p className="text-muted mb-4">Here's what's happening with your team's leave requests.</p>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <div className="row">
          <DashboardCard title="Pending Requests" value={stats.pending_requests} color="warning" icon="⏳" />
          <DashboardCard title="Approved Today" value={stats.approved_today} color="success" icon="✅" />
          <DashboardCard title="Total Employees" value={stats.total_employees} color="primary" icon="👥" />
        </div>
      )}

      <div className="mt-4">
        <Link to="/manager/requests" className="btn btn-primary">
          View Leave Requests
        </Link>
      </div>
    </Layout>
  )
}
