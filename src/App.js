import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Impor AuthProvider dan hook useAuth
import { AuthProvider, useAuth } from './auth/AuthContext';

// Impor semua halaman dan layout...
import LandingPage from './pages/LandingPage';
import LoginPage from './user/page/LoginPage';
import RegisterPage from './user/page/RegisterPage';
import DashboardLayout from './user/cms/DashboardLayout';
import DashboardHomePage from './user/cms/pages/DashboardHomePage';
import KategoriPage from './user/cms/pages/KategoriPage';
import SemuaTransaksiPage from './user/cms/pages/SemuaTransaksiPage';

const TransaksiWajibPage = () => <div>Halaman Transaksi Wajib</div>;

// Komponen baru untuk layar loading global
function GlobalLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center">
                 {/* Anda bisa mengganti ini dengan spinner atau animasi yang lebih bagus */}
                <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-xl font-semibold text-gray-600">Memuat Aplikasi...</p>
            </div>
        </div>
    )
}

function ProtectedRoute({ children }) {
    const { token } = useAuth();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

function PublicRoute({ children }) {
    const { token } = useAuth();
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

function AppRoutes() {
  // Ambil state loading dari AuthContext
  const { loading } = useAuth();

  // Jika aplikasi sedang memvalidasi token, tampilkan layar loading
  if (loading) {
    return <GlobalLoading />;
  }

  // Jika sudah tidak loading, baru render rute-rute aplikasi
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardHomePage />} />
        <Route path="kategori" element={<KategoriPage />} />
        <Route path="transaksi-wajib" element={<TransaksiWajibPage />} />
        <Route path="semua-transaksi" element={<SemuaTransaksiPage />} />
      </Route>

      <Route path="*" element={<div>404 - Halaman Tidak Ditemukan</div>} />
    </Routes>
  );
}

// Komponen App utama hanya membungkus provider dan AppRoutes
function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;
