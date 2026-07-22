import { useEffect, useState } from 'react'
import api from '../api/axios'
import Layout from '../components/Layout'

const STATUS_OPTIONS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actioningId, setActioningId] = useState(null)

  const pageSize = 10
  const totalPages = Math.max(Math.ceil(count / pageSize), 1)

  const fetchLeaves = async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page }
      if (statusFilter !== 'ALL') params.status = statusFilter
      if (search.trim()) params.search = search.trim()

      const { data } = await api.get('/leaves/manager/', { params })
      setLeaves(data.results || data)
      setCount(data.count ?? (data.results || data).length)
    } catch (err) {
      setError('Could not load leave requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaves()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    fetchLeaves()
  }

  const handleAction = async (id, action) => {
    setActioningId(id)
    setError('')
    try {
      await api.patch(`/leaves/manager/${id}/${action}/`)
      fetchLeaves()
    } catch (err) {
      setError(err.response?.data?.detail || `Could not ${action} this leave request.`)
    } finally {
      setActioningId(null)
    }
  }

  return (
    <Layout>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h4 className="mb-0">Leave Requests</h4>

        <div className="d-flex gap-2">
          <form className="d-flex" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="form-control form-control-sm me-2"
              placeholder="Search by employee or reason"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-sm btn-outline-secondary" type="submit">Search</button>
          </form>

          <select
            className="form-select form-select-sm w-auto"
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
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Employee</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
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
                    <td>{leave.employee_name}</td>
                    <td>{leave.start_date}</td>
                    <td>{leave.end_date}</td>
                    <td>{leave.number_of_days}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`badge status-badge-${leave.status}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      {leave.status === 'PENDING' ? (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-success"
                            disabled={actioningId === leave.id}
                            onClick={() => handleAction(leave.id, 'approve')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            disabled={actioningId === leave.id}
                            onClick={() => handleAction(leave.id, 'reject')}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted small">No action needed</span>
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
