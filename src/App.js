import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Impor halaman-halaman utama
import LandingPage from './pages/LandingPage';
import LoginPage from './user/page/LoginPage';
import RegisterPage from './user/page/RegisterPage';

// Impor layout dan halaman-halaman dasbor
import DashboardLayout from './user/cms/DashboardLayout';
import DashboardHomePage from './user/cms/pages/DashboardHomePage';

// Komponen placeholder untuk rute yang belum dibuat
const TransaksiWajibPage = () => <div>Halaman Transaksi Wajib</div>;
const SemuaTransaksiPage = () => <div>Halaman Semua Transaksi</div>;

// Komponen dummy untuk simulasi status login
const useAuth = () => {
    // Ganti ini dengan logika context Anda yang sebenarnya.
    // Untuk sekarang, kita anggap user sudah login jika ada token di localStorage.
    const token = localStorage.getItem('authToken');
    return { isAuthenticated: !!token };
};

// Komponen untuk melindungi rute dasbor
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        // Jika tidak login, alihkan ke halaman login
        return <Navigate to="/login" replace />;
    }
    return children;
}


function App() {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rute Dasbor yang Terproteksi */}
      <Route 
        path="/dashboard" 
        element={
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        }
      >
        {/* Sub-rute ini akan di-render di dalam <Outlet /> pada DashboardLayout */}
        <Route index element={<DashboardHomePage />} />
        <Route path="transaksi-wajib" element={<TransaksiWajibPage />} />
        <Route path="semua-transaksi" element={<SemuaTransaksiPage />} />
      </Route>

      {/* Rute fallback */}
      <Route path="*" element={<div>404 - Halaman Tidak Ditemukan</div>} />
    </Routes>
  );
}

export default App;
