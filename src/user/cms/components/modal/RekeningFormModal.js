import React, { useState, useEffect } from 'react';

function RekeningFormModal({ isOpen, onClose, onSave, rekening }) {
    const [namaBank, setNamaBank] = useState('');
    const [noRekening, setNoRekening] = useState('');
    const [saldoAwal, setSaldoAwal] = useState(0);

    // Efek ini akan mengisi form jika kita sedang mengedit rekening yang sudah ada
    useEffect(() => {
        if (rekening) {
            setNamaBank(rekening.nama_bank);
            setNoRekening(rekening.no_rekening || '');
            setSaldoAwal(rekening.saldo); // Saldo tidak bisa diedit, hanya ditampilkan
        } else {
            // Reset form jika untuk menambah baru
            setNamaBank('');
            setNoRekening('');
            setSaldoAwal(0);
        }
    }, [rekening, isOpen]); // Jalankan ulang jika rekening atau status modal berubah

    // Jangan render apa-apa jika modal tidak terbuka
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Hanya kirim field yang bisa diubah
        const dataToSave = {
            nama_bank: namaBank,
            no_rekening: noRekening,
        };
        // Tambahkan saldo hanya jika ini adalah rekening baru
        if (!rekening) {
            dataToSave.saldo = saldoAwal;
        }
        onSave(dataToSave);
    };

    return (
        // Overlay latar belakang
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            {/* Konten Modal */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    {rekening ? 'Edit Rekening' : 'Tambah Rekening Baru'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="nama-bank" className="block text-sm font-medium text-gray-700">Nama Bank / Dompet Digital</label>
                            <input 
                                type="text" 
                                id="nama-bank" 
                                value={namaBank} 
                                onChange={(e) => setNamaBank(e.target.value)} 
                                className="input-field mt-1" 
                                required 
                                placeholder="Contoh: BCA, GoPay"
                            />
                        </div>
                        <div>
                            <label htmlFor="no-rekening" className="block text-sm font-medium text-gray-700">No. Rekening (Opsional)</label>
                            <input 
                                type="text" 
                                id="no-rekening" 
                                value={noRekening} 
                                onChange={(e) => setNoRekening(e.target.value)} 
                                className="input-field mt-1" 
                            />
                        </div>
                         <div>
                            <label htmlFor="saldo-awal" className="block text-sm font-medium text-gray-700">Saldo Awal</label>
                            <input 
                                type="number" 
                                id="saldo-awal" 
                                value={saldoAwal} 
                                onChange={(e) => setSaldoAwal(e.target.value)} 
                                className="input-field mt-1" 
                                // Saldo awal hanya bisa diisi saat membuat rekening baru
                                disabled={!!rekening} 
                                placeholder="0"
                            />
                             {rekening && <p className="text-xs text-gray-500 mt-1">Saldo awal tidak dapat diubah. Saldo diperbarui melalui transaksi.</p>}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
                        <button type="submit" className="btn-primary">Simpan</button>
                    </div>
                </form>
            </div>
            {/* Menambahkan style utility ke dalam file agar tidak perlu menulis ulang di banyak tempat */}
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

export default RekeningFormModal;
