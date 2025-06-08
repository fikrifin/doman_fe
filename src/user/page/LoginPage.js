import React from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg text-center">
                <h1 className="text-3xl font-bold text-gray-800">Halaman Login</h1>
                <p className="mt-2 text-gray-600">Formulir login akan ditempatkan di sini.</p>
                <Link to="/" className="mt-6 inline-block px-6 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition">
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}

export default LoginPage;