export default function Footer() {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <div className="container text-center small">
        &copy; {new Date().getFullYear()} Employee Leave Management System
      </div>
    </footer>
  )
}
