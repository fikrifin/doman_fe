import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthContext'; // Sesuaikan path
import { EditIcon, DeleteIcon } from '../components/Icons'; // Sesuaikan path
import KategoriFormModal from '../components/modal/KategoriFormModal'; // Sesuaikan path

const API_URL = 'http://127.0.0.1:8000';

function KategoriPage() {
    const { token } = useAuth();
    const [kategoriList, setKategoriList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State untuk mengelola modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingKategori, setEditingKategori] = useState(null);

    // Fungsi untuk mengambil data dari API
    const fetchKategori = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/doman/kategori/`, {
                headers: { 'Authorization': `Token ${token}` },
            });
            if (!response.ok) throw new Error('Gagal memuat data.');
            const data = await response.json();
            setKategoriList(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Panggil fetchKategori saat komponen dimuat
    useEffect(() => {
        fetchKategori();
    }, [token]);

    const handleOpenModal = (kategori = null) => {
        setEditingKategori(kategori);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingKategori(null);
    };

    const handleSaveKategori = async (nama) => {
        const isEditing = !!editingKategori;
        const url = isEditing ? `${API_URL}/api/doman/kategori/${editingKategori.id}/` : `${API_URL}/api/doman/kategori/`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({ nama: nama }),
            });
            if (!response.ok) throw new Error('Gagal menyimpan kategori.');
            
            fetchKategori(); // Refresh data setelah berhasil
            handleCloseModal(); // Tutup modal
        } catch (err) {
            alert(err.message); // Tampilkan error, bisa diganti dengan notifikasi yang lebih baik
        }
    };

    const handleDeleteKategori = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            try {
                const response = await fetch(`${API_URL}/api/doman/kategori/${id}/`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Token ${token}` },
                });
                if (!response.ok) throw new Error('Gagal menghapus kategori.');
                
                fetchKategori(); // Refresh data setelah berhasil
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Kelola Kategori</h1>
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    + Tambah Kategori
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kategori</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading && <tr><td colSpan="2" className="text-center p-4">Memuat...</td></tr>}
                        {error && <tr><td colSpan="2" className="text-center p-4 text-red-500">{error}</td></tr>}
                        {!loading && !error && kategoriList.map((kategori) => (
                            <tr key={kategori.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{kategori.nama}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleOpenModal(kategori)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <EditIcon className="w-5 h-5"/>
                                    </button>
                                    <button onClick={() => handleDeleteKategori(kategori.id)} className="text-red-600 hover:text-red-900">
                                        <DeleteIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <KategoriFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveKategori}
                kategori={editingKategori}
            />
        </div>
    );
}

export default KategoriPage;
