import React, { useState, useEffect } from 'react';

function KategoriFormModal({ isOpen, onClose, onSave, kategori }) {
    const [nama, setNama] = useState('');

    // Efek ini akan mengisi form jika kita sedang mengedit kategori yang sudah ada
    useEffect(() => {
        if (kategori) {
            setNama(kategori.nama);
        } else {
            setNama(''); // Reset form jika untuk menambah baru
        }
    }, [kategori, isOpen]); // Jalankan ulang jika kategori atau status modal berubah

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(nama);
    };

    return (
        // Overlay
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            {/* Modal Content */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    {kategori ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="nama-kategori" className="block text-sm font-medium text-gray-700">Nama Kategori</label>
                        <input
                            type="text"
                            id="nama"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Batal
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default KategoriFormModal;
