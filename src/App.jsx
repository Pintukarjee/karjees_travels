import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import UserDashboard from './pages/UserDashboard'
import DriverDashboard from './pages/DriverDashboard'
import AdminDashboard from './pages/AdminDashboard'

function ProtectedRoute({ children, allowedRole }) {
  const role = localStorage.getItem('role')
  if (!role) return <Navigate to="/login" />
  if (allowedRole && role !== allowedRole) return <Navigate to="/login" />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<Landing />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/user"   element={<ProtectedRoute allowedRole="USER"><UserDashboard /></ProtectedRoute>} />
        <Route path="/driver" element={<ProtectedRoute allowedRole="DRIVER"><DriverDashboard /></ProtectedRoute>} />
        <Route path="/admin"  element={<ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="*"       element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}