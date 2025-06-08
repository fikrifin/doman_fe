import React, { useState } from 'react';
// Link untuk navigasi, useNavigate untuk mengalihkan setelah berhasil
import { Link, useNavigate } from 'react-router-dom';

// Definisikan URL API di satu tempat agar mudah diubah
const API_URL = 'http://127.0.0.1:8000';

function RegisterPage() {
    // State untuk menyimpan input dari form
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    
    // State untuk menangani pesan error dan status loading
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Hook untuk navigasi programmatic
    const navigate = useNavigate();

    // Fungsi yang akan dijalankan saat form di-submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // Mencegah halaman refresh

        // 1. Validasi Sederhana di Frontend
        if (password1 !== password2) {
            setError('Konfirmasi password tidak cocok!');
            return;
        }

        setError('');
        setLoading(true);

        // 2. Kirim Data ke API Backend
        try {
            const response = await fetch(`${API_URL}/api/user/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Pastikan nama field (password, password2) sesuai dengan yang diharapkan Django
                body: JSON.stringify({
                    username: username,
                    password1: password1,
                    password2: password2,
                }),
            });

            // Jika respons tidak OK (misal: status 400, 500)
            if (!response.ok) {
                const errorData = await response.json();
                // Menggabungkan semua pesan error dari backend menjadi satu string
                const messages = Object.values(errorData).flat().join(' ');
                throw new Error(messages || 'Registrasi gagal. Coba lagi.');
            }

            // 3. Handle jika registrasi berhasil
            // Beri notifikasi dan alihkan ke halaman login
            alert('Registrasi berhasil! Silakan login.');
            navigate('/login');

        } catch (err) {
            setError(err.message);
        } finally {
            // Hentikan status loading, baik berhasil maupun gagal
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Latar belakang animasi yang sama dengan Landing Page */}
            <div className="area" ><ul className="circles"><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul></div >
            
            {/* Form Container */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 z-10">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Buat Akun Baru</h1>
                <p className="text-center text-gray-500 mb-6">Mulai kelola keuangan Anda hari ini.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input 
                            id="username" 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input 
                            id="password1" 
                            type="password" 
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                            required 
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                    </div>
                    <div>
                        <label htmlFor="password2">Konfirmasi Password</label>
                        <input 
                            id="password2" 
                            type="password" 
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required 
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                    </div>

                    {/* Menampilkan pesan error jika ada */}
                    {error && <p className="text-sm text-center text-red-600 bg-red-50 p-2 rounded-md">{error}</p>}
                    
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full py-3 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition"
                    >
                        {loading ? 'Memproses...' : 'Daftar'}
                    </button>
                    
                    <p className="text-center text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
                            Login di sini
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
