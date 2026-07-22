import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Layout from '../components/Layout'

const today = new Date().toISOString().split('T')[0]

export default function ApplyLeave() {
  const [form, setForm] = useState({ start_date: '', end_date: '', reason: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validateClientSide = () => {
    const newErrors = {}
    if (!form.start_date) newErrors.start_date = 'Start date is required.'
    if (!form.end_date) newErrors.end_date = 'End date is required.'
    if (form.start_date && form.start_date < today) {
      newErrors.start_date = 'Start date cannot be in the past.'
    }
    if (form.start_date && form.end_date && form.end_date < form.start_date) {
      newErrors.end_date = 'End date cannot be before start date.'
    }
    if (!form.reason.trim()) newErrors.reason = 'Please provide a reason for leave.'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')

    const clientErrors = validateClientSide()
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    setLoading(true)
    setErrors({})
    try {
      await api.post('/leaves/', form)
      setSuccess('Leave request submitted successfully!')
      setForm({ start_date: '', end_date: '', reason: '' })
      setTimeout(() => navigate('/employee/history'), 1200)
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        setErrors(data)
      } else {
        setErrors({ non_field_errors: 'Something went wrong. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h4 className="mb-3">Apply for Leave</h4>

              {success && <div className="alert alert-success py-2">{success}</div>}
              {errors.non_field_errors && (
                <div className="alert alert-danger py-2">{errors.non_field_errors}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      min={today}
                      className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
                      value={form.start_date}
                      onChange={handleChange}
                    />
                    {errors.start_date && (
                      <div className="invalid-feedback">{errors.start_date}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      name="end_date"
                      min={form.start_date || today}
                      className={`form-control ${errors.end_date ? 'is-invalid' : ''}`}
                      value={form.end_date}
                      onChange={handleChange}
                    />
                    {errors.end_date && (
                      <div className="invalid-feedback">{errors.end_date}</div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Reason</label>
                  <textarea
                    name="reason"
                    rows="3"
                    className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                    value={form.reason}
                    onChange={handleChange}
                    placeholder="Briefly describe the reason for your leave"
                  />
                  {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Leave Request'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
