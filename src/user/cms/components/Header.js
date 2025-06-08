import React from 'react';
import { useAuth } from '../../../auth/AuthContext'; // Import useAuth untuk mendapatkan data user

function Header() {
    const { user } = useAuth(); // Ambil data user dari context
    const username = user?.username || "Pengguna"; // Gunakan username dari user atau fallback

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
            <div className="flex items-center">
                {/* Tombol menu untuk mobile bisa ditambahkan di sini */}
                <h1 className="text-lg font-semibold">Selamat Datang, {username}</h1>
            </div>
        </header>
    );
}

export default Header;
