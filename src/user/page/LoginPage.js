import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Definisikan URL API di satu tempat agar mudah diubah
const API_URL = 'http://127.0.0.1:8000';

function LoginPage() {
    // State untuk menyimpan input dari form
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // State untuk menangani pesan error dan status loading
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Hook untuk navigasi programmatic
    const navigate = useNavigate();

    // Fungsi yang akan dijalankan saat form di-submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // Mencegah halaman refresh
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Pastikan nama field (username, password) sesuai dengan yang diharapkan Django
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const data = await response.json();

            // Jika respons tidak OK (misal: status 400), backend dj-rest-auth
            // biasanya mengirim pesan error dalam 'non_field_errors' atau field lain.
            if (!response.ok) {
                // Mengambil pesan error utama atau pesan default
                const errorMessage = data.non_field_errors?.[0] || 'Username atau password salah.';
                throw new Error(errorMessage);
            }

            // --- PENTING ---
            // Jika login berhasil, backend akan mengembalikan 'key' atau 'access_token'
            // Untuk saat ini, kita akan simpan di localStorage dan log di console.
            // Langkah berikutnya adalah mengelola ini dengan React Context.
            console.log('Login berhasil! Token diterima:', data.key);
            localStorage.setItem('authToken', data.key);
            
            // Alihkan ke halaman dashboard setelah berhasil login
            navigate('/dashboard'); 

        } catch (err) {
            setError(err.message);
        } finally {
            // Hentikan status loading, baik berhasil maupun gagal
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Latar belakang animasi yang sama */}
            <div className="area" ><ul className="circles"><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul></div >
            
            {/* Form Container */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 z-10">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Selamat Datang Kembali</h1>
                <p className="text-center text-gray-500 mb-6">Silakan login ke akun Anda.</p>
                
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
                            id="password" 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {loading ? 'Memproses...' : 'Login'}
                    </button>
                    
                    <p className="text-center text-sm text-gray-600">
                        Belum punya akun?{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:underline">
                            Daftar di sini
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
