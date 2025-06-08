import React from 'react';

function DashboardHomePage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Ringkasan Keuangan</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">Pemasukan</div>
                <div className="bg-white p-6 rounded-xl shadow">Pengeluaran</div>
                <div className="bg-white p-6 rounded-xl shadow">Sisa Saldo</div>
            </div>
        </div>
    );
}

export default DashboardHomePage;
