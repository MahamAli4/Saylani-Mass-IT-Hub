import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import LostFoundPage from './pages/LostFoundPage';
import ComplaintPage from './pages/ComplaintPage';
import VolunteerPage from './pages/VolunteerPage';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Authenticated Routes wrapped in Layout via ProtectedRoute */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/lost-found" element={<ProtectedRoute><LostFoundPage /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute><ComplaintPage /></ProtectedRoute>} />
          <Route path="/volunteer" element={<ProtectedRoute><VolunteerPage /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
