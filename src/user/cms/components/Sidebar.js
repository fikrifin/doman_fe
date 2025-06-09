import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext'; // Sesuaikan path ini
import { DashboardIcon, WajibIcon, TransaksiIcon, KategoriIcon, LogoutIcon, CollapseIcon, ExpandIcon, RekeningIcon } from './Icons'; // Sesuaikan path ini

function Sidebar({ isCollapsed, toggleSidebar }) {
    const { logout } = useAuth();
    const activeLinkStyle = { 
        backgroundColor: '#4f46e5', 
        color: 'white' 
    };

    return (
        // Terapkan class lebar dinamis berdasarkan state isCollapsed
        <aside className={`bg-white shadow-lg flex-col flex transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
            
            {/* Header Sidebar */}
            <div className={`h-16 flex items-center border-b shrink-0 ${isCollapsed ? 'justify-center' : 'justify-start px-6'}`}>
                <Link to="/dashboard" className="text-2xl font-bold text-indigo-600">
                    {/* Tampilkan hanya 'K' jika sidebar kecil */}
                    <span className={isCollapsed ? 'hidden' : 'block'}>DoMan</span>
                    <span className={isCollapsed ? 'block' : 'hidden'}>DM</span>
                </Link>
            </div>
            
            {/* Menu Navigasi */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                <NavLink to="/dashboard" end style={({isActive}) => isActive ? activeLinkStyle : {}} className={`flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-500 hover:text-white ${isCollapsed && 'justify-center'}`}>
                    <DashboardIcon className="h-6 w-6 shrink-0" />
                    <span className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Dashboard</span>
                </NavLink>
                <NavLink to="/dashboard/rekening" end style={({isActive}) => isActive ? activeLinkStyle : {}} className={`flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-500 hover:text-white ${isCollapsed && 'justify-center'}`}>
                    <RekeningIcon className="h-6 w-6 shrink-0" />
                    <span className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Rekening</span>
                </NavLink>
                <NavLink to="/dashboard/tagihan" style={({isActive}) => isActive ? activeLinkStyle : {}} className={`flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-500 hover:text-white ${isCollapsed && 'justify-center'}`}>
                    <WajibIcon className="h-6 w-6 shrink-0" />
                    <span className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Tagihan</span>
                </NavLink>
                <NavLink to="/dashboard/semua-transaksi" style={({isActive}) => isActive ? activeLinkStyle : {}} className={`flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-500 hover:text-white ${isCollapsed && 'justify-center'}`}>
                    <TransaksiIcon className="h-6 w-6 shrink-0" />
                    <span className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Transaksi</span>
                </NavLink>
                <NavLink to="/dashboard/kategori" style={({isActive}) => isActive ? activeLinkStyle : {}} className={`flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-500 hover:text-white ${isCollapsed && 'justify-center'}`}>
                    <KategoriIcon className="h-6 w-6 shrink-0" />
                    <span className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Kategori</span>
                </NavLink>
            </nav>

            {/* Tombol Logout & Toggle */}
            <div className="p-4 border-t">
                <button onClick={logout} className={`w-full flex items-center text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-red-500 hover:text-white mb-2 ${isCollapsed && 'justify-center'}`}>
                    <LogoutIcon className="h-6 w-6 shrink-0" />
                    <span className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Logout</span>
                </button>
                <button onClick={toggleSidebar} className={`w-full flex items-center text-left px-4 py-3 rounded-lg text-gray-500 hover:bg-gray-200 ${isCollapsed && 'justify-center'}`}>
                    {isCollapsed ? <ExpandIcon className="h-6 w-6 shrink-0" /> : <CollapseIcon className="h-6 w-6 shrink-0" />}
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
