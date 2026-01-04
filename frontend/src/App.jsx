import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import LandingPage from './pages/LandingPage';
import MemberDashboard from './pages/MemberDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loader">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <LandingPage />;

  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return <Navigate to="/admin-dashboard" />;
  if (user.role === 'TRAINER') return <Navigate to="/trainer-dashboard" />;
  return <Navigate to="/member-dashboard" />;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen transition-colors duration-300">
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: '1rem',
                  fontSize: '0.9375rem',
                  fontWeight: '600',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(10px)'
                }
              }}
            />
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/member-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'SUPER_ADMIN']}>
                    <MemberDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trainer-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['TRAINER', 'ADMIN', 'SUPER_ADMIN']}>
                    <TrainerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
