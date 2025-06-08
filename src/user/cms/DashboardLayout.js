import React from 'react';
// Outlet adalah placeholder dari React Router untuk merender konten sub-rute
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function DashboardLayout() {
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {/* Di sinilah konten dari setiap halaman dasbor akan ditampilkan */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
