import React from 'react';
import LoginPage from '../user/page/LoginPage'; // Impor LoginPage dari lokasi baru
import RegisterPage from '../user/page/RegisterPage'; // Impor RegisterPage dari lokasi baru
// Impor komponen-komponen dari React Router
import { Routes, Route, Link } from 'react-router-dom';

// ====================================================================
// --- Halaman-Halaman Statis (Static Pages) ---
// Disarankan untuk menempatkan setiap komponen dalam filenya sendiri, 
// misalnya: src/pages/LandingPage.js
// ====================================================================

function LandingPage() {
    return (
        // Container utama sekarang 'relative' untuk menampung elemen animasi absolut
        <div className="text-white min-h-screen flex flex-col relative overflow-hidden">
            {/* Area untuk elemen animasi */}
            <div className="area" >
                <ul className="circles">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                </ul>
            </div >

            {/* Konten diletakkan di atas animasi dengan z-index */}
            <nav className="w-full p-6 flex justify-between items-center bg-white bg-opacity-10 backdrop-blur-md relative z-10">
                <h1 className="text-2xl font-bold">DoMan</h1>
                <div className="space-x-4">
                    {/* Menggunakan <Link> untuk navigasi ke rute yang sesuai */}
                    <Link to="/login" className="px-4 py-2 rounded-md hover:bg-white hover:bg-opacity-20 transition">Login</Link>
                    <Link to="/register" className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-md hover:bg-opacity-90 transition">Daftar Sekarang</Link>
                </div>
            </nav>

            <main className="flex-1 flex flex-col justify-center items-center text-center p-6 relative z-10">
                <h2 className="text-5xl md:text-6xl font-extrabold leading-tight" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
                    Ambil Kendali Penuh Atas Keuangan Anda
                </h2>
                <p className="mt-4 max-w-2xl text-lg md:text-xl opacity-90">
                    Lacak pemasukan, kelola pengeluaran, dan capai tujuan finansial Anda dengan mudah. Mulai sekarang, gratis!
                </p>
                <Link to="/register" className="mt-8 px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-full hover:bg-opacity-90 transition transform hover:scale-105 shadow-2xl">
                    Mulai Sekarang
                </Link>
            </main>
            
            <footer className="w-full p-6 text-center text-sm opacity-70 relative z-10">
                &copy; {new Date().getFullYear()} DoMan by Fikri. All rights reserved.
            </footer>
        </div>
    );
}

// ====================================================================
// --- Komponen Utama App.js (Hanya berisi Router) ---
// ====================================================================
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} /> {/* Rute LoginPage */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
            404 - Halaman Tidak Ditemukan
        </div>
      } />
    </Routes>
  );
}

export default App;
