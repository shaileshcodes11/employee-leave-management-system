export default function DashboardCard({ title, value, icon, color = 'primary' }) {
  return (
    <div className="col-md-4 col-sm-6 mb-3">
      <div className={`card border-0 shadow-sm border-start border-${color} border-4 h-100`}>
        <div className="card-body d-flex align-items-center justify-content-between">
          <div>
            <div className="text-muted small text-uppercase">{title}</div>
            <div className="fs-3 fw-bold">{value}</div>
          </div>
          {icon && <div className={`fs-1 text-${color}`}>{icon}</div>}
        </div>
      </div>
    </div>
  )
}
