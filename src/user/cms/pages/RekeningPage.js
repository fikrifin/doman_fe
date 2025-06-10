import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthContext';
// Impor ikon yang relevan
import { EditIcon, DeleteIcon, PlusIcon, CopyIcon } from '../components/Icons';
import RekeningFormModal from '../components/modal/RekeningFormModal';

const API_URL = 'http://127.0.0.1:8000';
const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

// Komponen Kartu ATM yang bisa digunakan kembali
const ATMCard = ({ rekening, onEdit, onDelete, onCopy, copiedId }) => {
    const { user } = useAuth(); // Ambil data user untuk nama
    
    // Logika untuk memilih gradient berdasarkan nama bank (bisa dikembangkan)
    const getCardGradient = (bankName) => {
        const name = bankName.toLowerCase();
        if (name.includes('kaltimtara')) return 'from-orange-500 to-yellow-500';
        if (name.includes('seabank')) return 'from-sky-600 to-cyan-400';
        if (name.includes('stockbit')) return 'from-sky-400 to-sky-600';
        if (name.includes('mandiri')) return 'from-purple-600 to-indigo-700';
        return 'from-gray-700 to-gray-900';
    };

    return (
        <div className={`text-white rounded-xl shadow-lg p-6 flex flex-col justify-between h-56 bg-gradient-to-br ${getCardGradient(rekening.nama_bank)}`}>
            {/* Bagian Atas Kartu */}
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{rekening.nama_bank}</h3>
                <div className="flex space-x-2">
                    <button onClick={() => onEdit(rekening)} className="text-white opacity-70 hover:opacity-100"><EditIcon className="w-5 h-5"/></button>
                    <button onClick={() => onDelete(rekening.id)} className="text-white opacity-70 hover:opacity-100"><DeleteIcon className="w-5 h-5"/></button>
                </div>
            </div>

            {/* Bagian Tengah (Nomor Rekening) */}
            <div className="my-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-mono tracking-wider">{rekening.no_rekening || 'Dompet Digital'}</span>
                    {rekening.no_rekening && (
                         <button onClick={() => onCopy(rekening.no_rekening, rekening.id)} className="text-white opacity-70 hover:opacity-100">
                            <CopyIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
                {copiedId === rekening.id && <span className="text-xs font-semibold">Tersalin!</span>}
            </div>

            {/* Bagian Bawah Kartu */}
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-sm opacity-80">Saldo Saat Ini</p>
                    <p className="text-2xl font-semibold">{formatRupiah(rekening.saldo)}</p>
                </div>
                <p className="text-sm font-semibold uppercase">{user ? user.username : 'PENGGUNA'}</p>
            </div>
        </div>
    );
};


function RekeningPage() {
    const { token } = useAuth();
    const [rekeningList, setRekeningList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRekening, setEditingRekening] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    const fetchRekening = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/doman/rekening/`, {
                headers: { 'Authorization': `Token ${token}` },
            });
            if (!response.ok) throw new Error('Gagal memuat data rekening.');
            const data = await response.json();
            setRekeningList(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRekening();
    }, [token]);
    
    const handleCopyToClipboard = (text, id) => {
        if (!navigator.clipboard) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                setCopiedId(id);
                setTimeout(() => setCopiedId(null), 2000);
            } catch (err) { console.error('Fallback: Gagal menyalin', err); }
            document.body.removeChild(textArea);
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }, (err) => { console.error('Gagal menyalin: ', err); });
    };

    const handleOpenModal = (rekening = null) => {
        setEditingRekening(rekening);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRekening(null);
    };

    const handleSaveRekening = async (formData) => {
        const isEditing = !!editingRekening;
        const url = isEditing ? `${API_URL}/api/doman/rekening/${editingRekening.id}/` : `${API_URL}/api/doman/rekening/`;
        const method = isEditing ? 'PATCH' : 'POST';
        try {
            await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` }, body: JSON.stringify(formData) });
            fetchRekening();
            handleCloseModal();
        } catch (err) { alert("Gagal menyimpan rekening."); }
    };
    
    const handleDeleteRekening = async (id) => {
        if (window.confirm('Yakin ingin menghapus rekening ini? Aksi ini hanya berhasil jika tidak ada transaksi terkait.')) {
            try {
                const response = await fetch(`${API_URL}/api/doman/rekening/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Token ${token}` } });
                if (!response.ok) { const errData = await response.json(); throw new Error(errData.detail || 'Gagal menghapus rekening.'); }
                fetchRekening();
            } catch (err) { alert(err.message); }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Kelola Rekening</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    <PlusIcon className="w-5 h-5" /> Tambah Rekening
                </button>
            </div>

            {loading && <p>Memuat...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!loading && !error && rekeningList.map((rekening) => (
                    <ATMCard 
                        key={rekening.id}
                        rekening={rekening}
                        onEdit={handleOpenModal}
                        onDelete={handleDeleteRekening}
                        onCopy={handleCopyToClipboard}
                        copiedId={copiedId}
                    />
                ))}
                 {!loading && !error && rekeningList.length === 0 && (
                    <div className="col-span-full text-center p-10 bg-white rounded-lg shadow">
                        <p className="text-gray-500">Anda belum memiliki rekening. Silakan tambahkan rekening baru.</p>
                    </div>
                 )}
            </div>

            <RekeningFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveRekening}
                rekening={editingRekening}
            />
        </div>
    );
}

export default RekeningPage;
