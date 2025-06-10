import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { EditIcon, DeleteIcon, PlusIcon, RekeningIcon, KategoriIcon } from '../components/Icons';
import TagihanFormModal from '../components/modal/TagihanFormModal';

const API_URL = 'http://127.0.0.1:8000';
const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

function TagihanPage() {
    const { token } = useAuth();
    const [tagihanList, setTagihanList] = useState([]);
    const [checklist, setChecklist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTagihan, setEditingTagihan] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tagihanRes, checklistRes] = await Promise.all([
                fetch(`${API_URL}/api/doman/tagihan/`, { headers: { 'Authorization': `Token ${token}` } }),
                fetch(`${API_URL}/api/doman/checklist/`, { headers: { 'Authorization': `Token ${token}` } })
            ]);
            if (!tagihanRes.ok || !checklistRes.ok) throw new Error('Gagal memuat data tagihan.');
            
            const tagihanData = await tagihanRes.json();
            const checklistData = await checklistRes.json();
            
            setTagihanList(tagihanData);
            setChecklist(checklistData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const handleOpenModal = (tagihan = null) => {
        setEditingTagihan(tagihan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTagihan(null);
    };

    const handleSaveTagihan = async (formData) => {
        const isEditing = !!editingTagihan;
        const url = isEditing ? `${API_URL}/api/doman/tagihan/${editingTagihan.id}/` : `${API_URL}/api/doman/tagihan/`;
        const method = isEditing ? 'PATCH' : 'POST';
        try {
            await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` }, body: JSON.stringify(formData) });
            fetchData();
            handleCloseModal();
        } catch (err) {
            alert('Gagal menyimpan tagihan.');
        }
    };

    const handleDeleteTagihan = async (id) => {
        if (window.confirm('Yakin ingin menghapus template tagihan ini?')) {
            try {
                await fetch(`${API_URL}/api/doman/tagihan/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Token ${token}` } });
                fetchData();
            } catch (err) {
                alert('Gagal menghapus tagihan.');
            }
        }
    };

    const handleTandaiLunas = async (tagihanId) => {
        try {
            const response = await fetch(`${API_URL}/api/doman/checklist/${tagihanId}/bayar/`, {
                method: 'POST',
                headers: { 'Authorization': `Token ${token}` }
            });
            if(!response.ok) throw new Error("Gagal menandai lunas.");
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    // --- LOGIKA BARU: MENGHITUNG TOTAL TAGIHAN PER REKENING ---
    const ringkasanPerRekening = useMemo(() => {
        const belumLunas = checklist.filter(item => !item.status_lunas);
        const ringkasan = belumLunas.reduce((acc, item) => {
            const namaRekening = item.rekening_info.split(' - ')[0];
            if (!acc[namaRekening]) {
                acc[namaRekening] = 0;
            }
            acc[namaRekening] += parseFloat(item.jumlah_tagihan);
            return acc;
        }, {});
        
        // Ubah dari objek menjadi array agar mudah di-map
        return Object.entries(ringkasan).map(([nama, total]) => ({ nama, total }));
    }, [checklist]);
    
    const lunasCount = checklist.filter(item => item.status_lunas).length;
    const totalCount = checklist.length;
    const progress = totalCount > 0 ? (lunasCount / totalCount) * 100 : 0;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Tagihan Rutin</h1>

            <div>
                {loading ? <p>Menghitung ringkasan...</p> : 
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {ringkasanPerRekening.length > 0 ? ringkasanPerRekening.map(item => (
                            <div key={item.nama} className="bg-white p-4 rounded-lg shadow-sm border">
                                <p className="text-sm font-semibold text-gray-500">{item.nama}</p>
                                <p className="text-xl font-bold text-red-600">{formatRupiah(item.total)}</p>
                            </div>
                        )) : <p className="col-span-full text-gray-500">Semua tagihan bulan ini sudah lunas!</p>}
                    </div>
                }
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold mb-1">Checklist Bulan Ini</h2>
                        <p className="text-sm text-gray-500 mb-4">{new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</p>
                        
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Progress</span>
                                <span className="text-sm font-medium text-gray-700">{lunasCount} dari {totalCount} Lunas</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            {loading && <p>Memuat checklist...</p>}
                            {!loading && checklist.map(item => (
                                <div key={item.id} className="border p-4 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className={`font-semibold text-lg ${item.status_lunas && 'text-gray-500'}`}>{item.deskripsi}</p>
                                        <p className="text-sm text-gray-500">Jatuh tempo tgl. {item.hari_jatuh_tempo} | {formatRupiah(item.jumlah_tagihan)}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleTandaiLunas(item.id)}
                                        disabled={item.status_lunas}
                                        className={`px-4 py-2 rounded-md font-semibold text-sm transition ${item.status_lunas ? 'bg-green-100 text-green-700 cursor-not-allowed' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                                    >
                                        {item.status_lunas ? 'Lunas' : 'Tandai Lunas'}
                                    </button>
                                </div>
                            ))}
                            {!loading && checklist.length === 0 && <p className="text-center text-gray-500 py-4">Tidak ada tagihan untuk bulan ini.</p>}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold">Template</h2>
                             <button onClick={() => handleOpenModal()} className="btn-primary-sm">
                                <PlusIcon className="w-4 h-4"/>
                             </button>
                        </div>
                        <div className="space-y-4">
                            {loading && <p>Memuat template...</p>}
                            {!loading && tagihanList.map(tagihan => (
                                <div key={tagihan.id} className={`p-4 rounded-lg border-l-4 ${tagihan.aktif ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
                                    <div className="flex justify-between items-start">
                                        <p className={`font-bold ${!tagihan.aktif && 'text-gray-400'}`}>{tagihan.deskripsi}</p>
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => handleOpenModal(tagihan)} className="text-gray-400 hover:text-indigo-600"><EditIcon className="w-4 h-4"/></button>
                                            <button onClick={() => handleDeleteTagihan(tagihan.id)} className="text-gray-400 hover:text-red-600"><DeleteIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 mt-2 space-x-4">
                                        <div className="flex items-center gap-1">
                                            <RekeningIcon className="w-4 h-4"/>
                                            <span>{tagihan.rekening_info.split(' - ')[0]}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <KategoriIcon className="w-4 h-4"/>
                                            <span>{tagihan.kategori_nama || 'Lainnya'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                             {!loading && tagihanList.length === 0 && <p className="text-center text-gray-500 py-4">Belum ada template tagihan.</p>}
                        </div>
                    </div>
                </div>
            </div>

            <TagihanFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveTagihan}
                tagihan={editingTagihan}
            />
            <style jsx global>{`
                .btn-primary-sm { padding: 0.5rem; background-color: #4f46e5; color: white; border-radius: 0.375rem; }
                .btn-primary-sm:hover { background-color: #4338ca; }
            `}</style>
        </div>
    );
}

export default TagihanPage;

