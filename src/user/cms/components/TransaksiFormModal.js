import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthContext'; // Sesuaikan path

const API_URL = 'http://127.0.0.1:8000';

function TransaksiFormModal({ isOpen, onClose, onSave, transaksi }) {
    const { token } = useAuth();
    
    // State untuk form fields
    const [deskripsi, setDeskripsi] = useState('');
    const [jumlah, setJumlah] = useState('');
    const [jenis, setJenis] = useState('OUT'); // Default: Pengeluaran
    const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]); // Default: Hari ini
    const [kategori, setKategori] = useState('');

    // State untuk menyimpan daftar kategori dari API
    const [kategoriList, setKategoriList] = useState([]);

    // Efek untuk mengambil daftar kategori saat modal pertama kali dibuka
    useEffect(() => {
        const fetchKategori = async () => {
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/api/doman/kategori/`, {
                        headers: { 'Authorization': `Token ${token}` },
                    });
                    const data = await response.json();
                    setKategoriList(data);
                } catch (error) {
                    console.error("Gagal memuat kategori:", error);
                }
            }
        };
        if (isOpen) {
            fetchKategori();
        }
    }, [isOpen, token]);

    // Efek untuk mengisi form jika sedang dalam mode edit
    useEffect(() => {
        if (transaksi) {
            setDeskripsi(transaksi.deskripsi);
            setJumlah(transaksi.jumlah);
            setJenis(transaksi.jenis);
            setTanggal(transaksi.tanggal);
            setKategori(transaksi.kategori); // `transaksi.kategori` adalah ID
        } else {
            // Reset form untuk mode tambah baru
            setDeskripsi('');
            setJumlah('');
            setJenis('OUT');
            setTanggal(new Date().toISOString().split('T')[0]);
            setKategori('');
        }
    }, [transaksi, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            deskripsi,
            jumlah,
            jenis,
            tanggal,
            kategori: kategori || null, // Kirim null jika tidak ada kategori yang dipilih
        };
        onSave(dataToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">
                    {transaksi ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Kolom 1 */}
                    <div className="md:col-span-2">
                        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <input type="text" id="deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="mt-1 input-field" required />
                    </div>
                    <div>
                        <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700">Jumlah (Rp)</label>
                        <input type="number" id="jumlah" value={jumlah} onChange={(e) => setJumlah(e.target.value)} className="mt-1 input-field" placeholder="50000" required />
                    </div>
                    <div>
                        <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">Tanggal</label>
                        <input type="date" id="tanggal" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="mt-1 input-field" required />
                    </div>
                    <div>
                        <label htmlFor="jenis" className="block text-sm font-medium text-gray-700">Jenis</label>
                        <select id="jenis" value={jenis} onChange={(e) => setJenis(e.target.value)} className="mt-1 input-field" required>
                            <option value="OUT">Pengeluaran</option>
                            <option value="IN">Pemasukan</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">Kategori</label>
                        <select id="kategori" value={kategori} onChange={(e) => setKategori(e.target.value)} className="mt-1 input-field">
                            <option value="">-- Tanpa Kategori --</option>
                            {kategoriList.map(kat => (
                                <option key={kat.id} value={kat.id}>{kat.nama}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Batal
                        </button>
                        <button type="submit" className="btn-primary">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
            {/* Menambahkan style utility ke dalam file CSS agar tidak berulang */}
            <style jsx global>{`
                .input-field {
                    display: block;
                    width: 100%;
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    padding: 0.5rem 0.75rem;
                }
                .input-field:focus {
                    outline: none;
                    --tw-ring-color: #4f46e5;
                    border-color: #4f46e5;
                }
                .btn-primary {
                    padding: 0.5rem 1rem;
                    background-color: #4f46e5;
                    color: white;
                    border-radius: 0.375rem;
                }
                .btn-primary:hover {
                    background-color: #4338ca;
                }
                .btn-secondary {
                    padding: 0.5rem 1rem;
                    background-color: #e5e7eb;
                    color: #1f2937;
                    border-radius: 0.375rem;
                }
                .btn-secondary:hover {
                    background-color: #d1d5db;
                }
            `}</style>
        </div>
    );
}

export default TransaksiFormModal;

