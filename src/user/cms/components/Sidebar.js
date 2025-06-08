import React from 'react';
// NavLink digunakan agar bisa memberi style pada link yang sedang aktif
import { NavLink, Link } from 'react-router-dom';

function Sidebar() {
    // Fungsi untuk logout bisa ditambahkan di sini nanti
    const handleLogout = () => {
        // Logika logout akan ditambahkan kemudian
        alert('Fungsi logout belum diimplementasikan.');
    };

    // Style untuk link yang aktif
    const activeLinkStyle = {
        backgroundColor: '#4f46e5', // bg-indigo-600
        color: 'white',
    };

    return (
        <aside className="w-64 bg-white shadow-lg flex-col hidden md:flex">
            <div className="h-16 flex items-center justify-center border-b">
                <Link to="/dashboard" className="text-2xl font-bold text-indigo-600">
                    DoMan
                </Link>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <NavLink 
                    to="/dashboard" 
                    end // 'end' penting agar tidak aktif saat sub-rute aktif
                    style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-500 hover:text-white transition"
                >
                    Dashboard
                </NavLink>
                <NavLink 
                    to="/dashboard/transaksi-wajib"
                    style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-500 hover:text-white transition"
                >
                    Transaksi Wajib
                </NavLink>
                <NavLink 
                    to="/dashboard/semua-transaksi"
                    style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-500 hover:text-white transition"
                >
                    Semua Transaksi
                </NavLink>
            </nav>
            <div className="p-4 border-t">
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-red-500 hover:text-white transition">
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;