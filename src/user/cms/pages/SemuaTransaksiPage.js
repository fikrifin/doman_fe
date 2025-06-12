import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { EditIcon, DeleteIcon, PlusIcon } from '../components/Icons';
import TransaksiFormModal from '../components/modal/TransaksiFormModal';

const API_URL = 'http://127.0.0.1:8000';

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

function SemuaTransaksiPage() {
    const { token } = useAuth();
    const [transaksiList, setTransaksiList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- State untuk filter ---
    const [bulan, setBulan] = useState(new Date().getMonth() + 1);
    const [tahun, setTahun] = useState(new Date().getFullYear());
    const [rekeningFilter, setRekeningFilter] = useState('');
    const [kategoriFilter, setKategoriFilter] = useState('');

    // --- State baru untuk PAGINASI ---
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationData, setPaginationData] = useState({ count: 0, next: null, previous: null });

    // State untuk data dropdown filter
    const [rekeningList, setRekeningList] = useState([]);
    const [kategoriList, setKategoriList] = useState([]);

    // State untuk modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaksi, setEditingTransaksi] = useState(null);

    useEffect(() => {
        const fetchDataForFilters = async () => {
            if (token) {
                try {
                    const [rekeningRes, kategoriRes] = await Promise.all([
                        fetch(`${API_URL}/api/doman/rekening/`, { headers: { 'Authorization': `Token ${token}` } }),
                        fetch(`${API_URL}/api/doman/kategori/`, { headers: { 'Authorization': `Token ${token}` } })
                    ]);
                    setRekeningList(await rekeningRes.json());
                    setKategoriList(await kategoriRes.json());
                } catch (error) { console.error("Gagal memuat data filter:", error); }
            }
        };
        fetchDataForFilters();
    }, [token]);

    const fetchTransaksi = async () => {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
            bulan: bulan,
            tahun: tahun,
            page: currentPage, // <-- Tambahkan nomor halaman ke parameter
        });
        if (rekeningFilter) params.append('rekening', rekeningFilter);
        if (kategoriFilter) params.append('kategori', kategoriFilter);

        try {
            const response = await fetch(`${API_URL}/api/doman/transaksi/?${params.toString()}`, {
                headers: { 'Authorization': `Token ${token}` },
            });
            if (!response.ok) throw new Error('Gagal memuat transaksi.');
            const data = await response.json();
            // --- Tangani respons paginasi ---
            setTransaksiList(data.results);
            setPaginationData({ count: data.count, next: data.next, previous: data.previous });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    // Reset ke halaman 1 setiap kali filter utama berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [bulan, tahun, rekeningFilter, kategoriFilter]);

    // Fetch ulang data jika halaman atau filter berubah
    useEffect(() => {
        if(token) {
            fetchTransaksi();
        }
    }, [token, currentPage, bulan, tahun, rekeningFilter, kategoriFilter]);

    const handleOpenModal = (transaksi = null) => { setEditingTransaksi(transaksi); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setEditingTransaksi(null); };
    
    const handleSaveTransaksi = async (formData) => {
        const isEditing = !!editingTransaksi;
        const url = isEditing ? `${API_URL}/api/doman/transaksi/${editingTransaksi.id}/` : `${API_URL}/api/doman/transaksi/`;
        const method = isEditing ? 'PUT' : 'POST';
        try {
            await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` }, body: JSON.stringify(formData) });
            fetchTransaksi(); // Refresh data pada halaman saat ini
            handleCloseModal();
        } catch (err) { alert(err.message); }
    };

    const handleDeleteTransaksi = async (id) => {
        if (window.confirm('Yakin ingin menghapus transaksi ini? Saldo rekening terkait akan dikembalikan.')) {
            try {
                await fetch(`${API_URL}/api/doman/transaksi/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Token ${token}` } });
                fetchTransaksi(); // Refresh data pada halaman saat ini
            } catch (err) { alert('Gagal menghapus transaksi.'); }
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Riwayat Transaksi</h1>
                <div className="flex items-center flex-wrap justify-end gap-2">
                    <select value={rekeningFilter} onChange={(e) => setRekeningFilter(e.target.value)} className="filter-select">
                        <option value="">Semua Rekening</option>
                        {rekeningList.map(rek => <option key={rek.id} value={rek.id}>{rek.nama_bank}</option>)}
                    </select>
                     <select value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)} className="filter-select">
                        <option value="">Semua Kategori</option>
                        {kategoriList.map(kat => <option key={kat.id} value={kat.id}>{kat.nama}</option>)}
                    </select>
                    <select value={bulan} onChange={(e) => setBulan(e.target.value)} className="filter-select">
                        {Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('id-ID', {month: 'long'})}</option>)}
                    </select>
                    <select value={tahun} onChange={(e) => setTahun(e.target.value)} className="filter-select">
                        {Array.from({length: 5}, (_, i) => <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>)}
                    </select>
                    <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                        <PlusIcon className="w-5 h-5" /><span className="font-semibold">Tambah</span>
                    </button>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="th-cell">Tanggal</th>
                                <th className="th-cell">Deskripsi</th>
                                <th className="th-cell">Rekening</th>
                                <th className="th-cell">Kategori</th>
                                <th className="th-cell">Jenis</th>
                                <th className="th-cell text-right">Jumlah</th>
                                <th className="th-cell text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading && <tr><td colSpan="7" className="text-center p-6 text-gray-500">Memuat data...</td></tr>}
                            {error && <tr><td colSpan="7" className="text-center p-6 text-red-500">{error}</td></tr>}
                            {!loading && !error && transaksiList.length === 0 && (
                                <tr><td colSpan="7" className="text-center p-6 text-gray-500">Tidak ada data transaksi yang cocok dengan filter.</td></tr>
                            )}
                            {!loading && !error && transaksiList.map((trx) => (
                                <tr key={trx.id} className="hover:bg-gray-50">
                                    <td className="td-cell text-gray-600">{formatDate(trx.tanggal)}</td>
                                    <td className="td-cell font-medium text-gray-800">{trx.deskripsi}</td>
                                    <td className="td-cell text-gray-600">{trx.rekening_info.split(' - ')[0] || '-'}</td>
                                    <td className="td-cell text-gray-600">{trx.kategori_nama || '-'}</td>
                                    <td className="td-cell">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${trx.jenis === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {trx.jenis === 'IN' ? 'Pemasukan' : 'Pengeluaran'}
                                        </span>
                                    </td>
                                    <td className={`td-cell text-right font-bold ${trx.jenis === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                                        {trx.jenis === 'IN' ? '+' : '-'} {formatRupiah(trx.jumlah)}
                                    </td>
                                    <td className="td-cell text-center">
                                        <button onClick={() => handleOpenModal(trx)} className="text-indigo-600 hover:text-indigo-900 mr-4"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteTransaksi(trx.id)} className="text-red-600 hover:text-red-900"><DeleteIcon className="w-5 h-5" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 flex items-center justify-between border-t">
                    <span className="text-sm text-gray-600">
                        Total {paginationData.count} transaksi
                    </span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            disabled={!paginationData.previous}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sebelumnya
                        </button>
                        <button 
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={!paginationData.next}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Berikutnya
                        </button>
                    </div>
                </div>
            </div>

            <TransaksiFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveTransaksi} transaksi={editingTransaksi} />
            <style jsx global>{`
                .th-cell { padding: 0.75rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
                .td-cell { padding: 1rem 1.5rem; white-space: nowrap; font-size: 0.875rem; }
                .filter-select { background-color: white; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem 2.5rem 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.25rem; --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color); box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow); }
                .filter-select:focus { outline: 2px solid transparent; outline-offset: 2px; --tw-ring-color: #4f46e5; border-color: #4f46e5; }
            `}</style>
        </div>
    );
}

export default SemuaTransaksiPage;