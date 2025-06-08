import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function DashboardLayout() {
    // State untuk mengontrol apakah sidebar dikecilkan atau tidak
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Berikan state dan fungsi toggle ke Sidebar */}
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
