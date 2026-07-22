import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Layout from '../components/Layout'
import DashboardCard from '../components/DashboardCard'
import { useAuth } from '../context/AuthContext'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/employee/')
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
      <p className="text-muted mb-4">Here's an overview of your leave status.</p>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <div className="row">
          <DashboardCard title="Remaining Leave" value={stats.remaining_leave} color="success" icon="🗓️" />
          <DashboardCard title="Approved Leaves" value={stats.approved_leaves} color="primary" icon="✅" />
          <DashboardCard title="Pending Leaves" value={stats.pending_leaves} color="warning" icon="⏳" />
        </div>
      )}

      <div className="mt-4 d-flex gap-2">
        <Link to="/employee/apply-leave" className="btn btn-primary">
          Apply Leave
        </Link>
        <Link to="/employee/history" className="btn btn-outline-secondary">
          Leave History
        </Link>
      </div>
    </Layout>
  )
}
