import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Impor AuthProvider dan hook useAuth
import { AuthProvider, useAuth } from './auth/AuthContext';

// Impor halaman-halaman utama
import LandingPage from './pages/LandingPage';
import LoginPage from './user/page/LoginPage';
import RegisterPage from './user/page/RegisterPage';

// Impor layout dan halaman-halaman dasbor
import DashboardLayout from './user/cms/DashboardLayout';
import DashboardHomePage from './user/cms/pages/DashboardHomePage';

// Komponen placeholder
const TransaksiWajibPage = () => <div>Halaman Transaksi Wajib</div>;
const SemuaTransaksiPage = () => <div>Halaman Semua Transaksi</div>;

// Komponen untuk melindungi rute dasbor
function ProtectedRoute({ children }) {
    // Gunakan hook useAuth yang asli
    const { token } = useAuth();
    if (!token) {
        // Jika tidak ada token, alihkan ke halaman login
        return <Navigate to="/login" replace />;
    }
    return children;
}

// Komponen untuk rute publik (pengguna tidak boleh mengakses jika sudah login)
function PublicRoute({ children }) {
    const { token } = useAuth();
    if (token) {
        // Jika sudah login, alihkan ke dashboard
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Rute Dasbor yang Terproteksi */}
      <Route 
        path="/dashboard" 
        element={
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHomePage />} />
        <Route path="transaksi-wajib" element={<TransaksiWajibPage />} />
        <Route path="semua-transaksi" element={<SemuaTransaksiPage />} />
      </Route>

      {/* Rute fallback */}
      <Route path="*" element={<div>404 - Halaman Tidak Ditemukan</div>} />
    </Routes>
  );
}

// Komponen App utama sekarang hanya membungkus provider
function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;
