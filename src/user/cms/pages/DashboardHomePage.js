import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { Link } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000';

// Fungsi helper untuk memformat angka menjadi format mata uang Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// Fungsi helper untuk memformat tanggal
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

// Komponen Card untuk Ringkasan, bisa digunakan kembali
const SummaryCard = ({ title, value, colorClass = 'text-gray-800' }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex-1">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        <p className={`text-3xl font-bold mt-2 ${colorClass}`}>{formatRupiah(value)}</p>
    </div>
);

function DashboardHomePage() {
    const { token } = useAuth();
    const [overviewData, setOverviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOverview = async () => {
            if (!token) return;
            setLoading(true);
            setError(null);
            try {
                // Panggil endpoint overview yang baru
                const response = await fetch(`${API_URL}/api/doman/transaksi/overview/`, {
                    headers: { 'Authorization': `Token ${token}` },
                });
                if (!response.ok) throw new Error('Gagal memuat data dasbor.');
                const data = await response.json();
                setOverviewData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOverview();
    }, [token]);

    if (loading) {
        return <div className="text-center p-10">Memuat data dasbor...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">Error: {error}</div>;
    }

    if (!overviewData) {
        return <div className="text-center p-10">Tidak ada data untuk ditampilkan.</div>;
    }

    const { ringkasan_bulan_ini, ringkasan_keseluruhan, riwayat_terakhir } = overviewData;

    return (
        <div className="space-y-8">
            {/* Bagian Ringkasan Keseluruhan */}
            <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4">Ringkasan Keseluruhan Rekening</h2>
                <div className="flex flex-col md:flex-row gap-6">
                    <SummaryCard title="Total Pemasukan" value={ringkasan_keseluruhan.total_pemasukan} colorClass="text-green-600" />
                    <SummaryCard title="Total Pengeluaran" value={ringkasan_keseluruhan.total_pengeluaran} colorClass="text-red-600" />
                    <SummaryCard title="Total Sisa Saldo" value={ringkasan_keseluruhan.sisa_saldo} colorClass="text-blue-600" />
                </div>
            </div>

            {/* Bagian Ringkasan Bulan Ini */}
            <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4">Ringkasan Bulan Ini({new Date().toLocaleString('id-ID', {month: 'long', year: 'numeric'})})</h2>
                <div className="flex flex-col md:flex-row gap-6">
                    <SummaryCard title="Pemasukan Bulan Ini" value={ringkasan_bulan_ini.total_pemasukan} colorClass="text-green-600" />
                    <SummaryCard title="Pengeluaran Bulan Ini" value={ringkasan_bulan_ini.total_pengeluaran} colorClass="text-red-600" />
                    <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg flex-1">
                        <h3 className="text-sm font-semibold text-indigo-200 uppercase tracking-wider">Sisa Saldo Bulan Ini</h3>
                        <p className="text-3xl font-bold mt-2">{formatRupiah(ringkasan_bulan_ini.sisa_saldo)}</p>
                    </div>
                </div>
            </div>

            {/* Bagian Riwayat Terakhir */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-700">Riwayat Terakhir Bulan Ini</h2>
                    <Link to="/dashboard/semua-transaksi" className="text-sm font-semibold text-indigo-600 hover:underline">
                        Lihat Semua
                    </Link>
                </div>
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white divide-y divide-gray-200">
                            {riwayat_terakhir.length === 0 ? (
                                <tr><td colSpan="3" className="text-center p-6 text-gray-500">Belum ada transaksi bulan ini.</td></tr>
                            ) : (
                                riwayat_terakhir.map(trx => (
                                    <tr key={trx.id}>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{trx.deskripsi}</div>
                                            <div className="text-sm text-gray-500">{formatDate(trx.tanggal)}</div>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-semibold whitespace-nowrap ${trx.jenis === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                                            {trx.jenis === 'IN' ? '+' : '-'} {formatRupiah(trx.jumlah)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DashboardHomePage;
