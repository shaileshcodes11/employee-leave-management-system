import { useEffect, useState } from 'react'
import api from '../api/axios'
import Layout from '../components/Layout'

const STATUS_OPTIONS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']

export default function LeaveHistory() {
  const [leaves, setLeaves] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  const pageSize = 10
  const totalPages = Math.max(Math.ceil(count / pageSize), 1)

  const fetchLeaves = async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page }
      if (statusFilter !== 'ALL') params.status = statusFilter

      const { data } = await api.get('/leaves/', { params })
      setLeaves(data.results || data)
      setCount(data.count ?? (data.results || data).length)
    } catch (err) {
      setError('Could not load leave history.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaves()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter])

  const handleCancel = async (id) => {
    setCancellingId(id)
    try {
      await api.patch(`/leaves/${id}/cancel/`)
      fetchLeaves()
    } catch (err) {
      setError('Could not cancel this leave request.')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Leave History</h4>
        <select
          className="form-select w-auto"
          value={statusFilter}
          onChange={(e) => {
            setPage(1)
            setStatusFilter(e.target.value)
          }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Applied On</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary" />
                  </td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.start_date}</td>
                    <td>{leave.end_date}</td>
                    <td>{leave.number_of_days}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`badge status-badge-${leave.status}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>{new Date(leave.applied_at).toLocaleDateString()}</td>
                    <td>
                      {leave.status === 'PENDING' && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={cancellingId === leave.id}
                          onClick={() => handleCancel(leave.id)}
                        >
                          {cancellingId === leave.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(p)}>{p}</button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </Layout>
  )
}
