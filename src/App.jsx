import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Report from './pages/Report'
import History from './pages/History'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Entry from './pages/Entry'
import Register from './pages/Register'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/report/latest" replace />} />
        <Route path="/report/latest" element={<Report />} />
        <Route path="/report/:date" element={<Report />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/entry" element={<Entry />} />
        <Route path="/admin/entry/:date" element={<Entry />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
