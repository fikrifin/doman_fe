import React, { useState } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { NotificationIcon } from './Icons';
import { Link } from 'react-router-dom';

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

function Header() {
    const { user, notifications } = useAuth(); // Ambil notifikasi dari context
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const notificationCount = notifications ? notifications.length : 0;

    return (
        <header className="h-16 bg-white border-b flex items-center justify-end px-6">
            <div className="flex items-center space-x-4">
                {/* --- Tombol Notifikasi --- */}
                <div className="relative">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <NotificationIcon className="h-6 w-6" />
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                {notificationCount}
                            </span>
                        )}
                    </button>
                    
                    {/* --- Panel Dropdown Notifikasi --- */}
                    {isDropdownOpen && (
                        <div 
                            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-20 border"
                            onMouseLeave={() => setIsDropdownOpen(false)} // Tutup jika mouse keluar
                        >
                            <div className="p-4 font-bold border-b text-gray-700">Notifikasi Tagihan</div>
                            <div className="max-h-96 overflow-y-auto">
                                {notificationCount > 0 ? (
                                    notifications.map(notif => (
                                        <Link 
                                            to="/dashboard/tagihan" 
                                            key={notif.id}
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="block px-4 py-3 hover:bg-gray-100 border-b last:border-b-0"
                                        >
                                            <p className="font-semibold text-gray-800">{notif.deskripsi}</p>
                                            <p className="text-sm text-gray-600">
                                                Jatuh tempo tgl {notif.hari_jatuh_tempo}. Sejumlah {formatRupiah(notif.jumlah_tagihan)}.
                                            </p>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="p-4 text-sm text-gray-500">Tidak ada notifikasi baru.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Avatar Pengguna */}
                <span className="text-right hidden sm:block">
                    <div className="font-semibold">{user ? user.username : '...'}</div>
                    <div className="text-xs text-gray-500">{user ? user.email : '...'}</div>
                </span>
                <img 
                    className="w-10 h-10 rounded-full" 
                    src={`https://ui-avatars.com/api/?name=${user ? user.username : 'U'}&background=E2E8F0&color=4A5568`} 
                    alt="User Avatar"
                />
            </div>
        </header>
    );
}

export default Header;
