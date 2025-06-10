import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../auth/AuthContext';

const API_URL = 'http://127.0.0.1:8000';

function TagihanFormModal({ isOpen, onClose, onSave, tagihan }) {
    const { token } = useAuth();

    // State untuk form fields
    const [deskripsi, setDeskripsi] = useState('');
    const [jumlahTagihan, setJumlahTagihan] = useState('');
    const [hariJatuhTempo, setHariJatuhTempo] = useState('');
    const [rekeningId, setRekeningId] = useState('');
    const [kategoriId, setKategoriId] = useState('');
    const [aktif, setAktif] = useState(true);

    // State untuk data dropdown
    const [rekeningList, setRekeningList] = useState([]);
    const [kategoriList, setKategoriList] = useState([]);

    // Ambil data untuk dropdown (rekening & kategori) saat modal dibuka
    useEffect(() => {
        const fetchDataForDropdowns = async () => {
            if (isOpen && token) {
                try {
                    const [rekeningRes, kategoriRes] = await Promise.all([
                        fetch(`${API_URL}/api/doman/rekening/`, { headers: { 'Authorization': `Token ${token}` } }),
                        fetch(`${API_URL}/api/doman/kategori/`, { headers: { 'Authorization': `Token ${token}` } })
                    ]);
                    const rekeningData = await rekeningRes.json();
                    const kategoriData = await kategoriRes.json();
                    setRekeningList(rekeningData);
                    setKategoriList(kategoriData);
                } catch (error) {
                    console.error("Gagal memuat data form:", error);
                }
            }
        };
        fetchDataForDropdowns();
    }, [isOpen, token]);

    // Isi form jika dalam mode edit
    useEffect(() => {
        if (tagihan) {
            setDeskripsi(tagihan.deskripsi);
            setJumlahTagihan(tagihan.jumlah_tagihan);
            setHariJatuhTempo(tagihan.hari_jatuh_tempo);
            setRekeningId(tagihan.rekening);
            setKategoriId(tagihan.kategori);
            setAktif(tagihan.aktif);
        } else {
            // Reset form
            setDeskripsi('');
            setJumlahTagihan('');
            setHariJatuhTempo('');
            setRekeningId('');
            setKategoriId('');
            setAktif(true);
        }
    }, [tagihan, isOpen]);

    if (!isOpen) return null;

    const inputJumlahTagihan = (value) => {
        // Hapus semua karakter non-digit kecuali angka
        const numericValue = value.replace(/\D/g, '');

        // Simpan nilai asli (tanpa format) ke state
        setJumlahTagihan(numericValue);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            deskripsi,
            jumlah_tagihan: jumlahTagihan,
            hari_jatuh_tempo: hariJatuhTempo,
            rekening: rekeningId,
            kategori: kategoriId || null,
            aktif,
        };
        onSave(dataToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">
                    {tagihan ? 'Edit Tagihan' : 'Tambah Tagihan Baru'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="deskripsi-tagihan">Deskripsi</label>
                        <input type="text" id="deskripsi-tagihan" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="input-field mt-1" required />
                    </div>
                    <div>
                        <label htmlFor="jumlah-tagihan">Tagihan Jumlah (Rp)</label>
                        <input type="text" 
                            id="jumlah-tagihan" 
                            value={new Intl.NumberFormat('id-ID').format(jumlahTagihan)} 
                            onChange={(e) => inputJumlahTagihan(e.target.value)} 
                            className="mt-1 input-field" 
                            placeholder="50000" 
                            required />
                    </div>
                    <div>
                        <label htmlFor="jatuh-tempo">Tgl Jatuh Tempo (1-31)</label>
                        <input type="number" id="jatuh-tempo" value={hariJatuhTempo} onChange={(e) => setHariJatuhTempo(e.target.value)} min="1" max="31" className="input-field mt-1" required />
                    </div>
                    <div>
                        <label htmlFor="rekening-tagihan">Rekening Pembayaran</label>
                        <select id="rekening-tagihan" value={rekeningId} onChange={(e) => setRekeningId(e.target.value)} className="input-field mt-1" required>
                            <option value="" disabled>-- Pilih Rekening --</option>
                            {rekeningList.map(rek => <option key={rek.id} value={rek.id}>{rek.nama_bank}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="kategori-tagihan">Kategori</label>
                        <select id="kategori-tagihan" value={kategoriId} onChange={(e) => setKategoriId(e.target.value)} className="input-field mt-1">
                            <option value="">-- Tanpa Kategori --</option>
                            {kategoriList.map(kat => <option key={kat.id} value={kat.id}>{kat.nama}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2 flex items-center">
                        <input type="checkbox" id="aktif" checked={aktif} onChange={(e) => setAktif(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                        <label htmlFor="aktif" className="ml-2 block text-sm text-gray-900">Tagihan ini aktif</label>
                    </div>
                    <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                        <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
                        <button type="submit" className="btn-primary">Simpan</button>
                    </div>
                </form>
            </div>
            {/* ... (style jsx global) ... */}
            <style jsx global>{`
                .input-field { display: block; width: 100%; border: 1px solid #d1d5db; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); padding: 0.5rem 0.75rem; }
                .input-field:focus { outline: none; --tw-ring-color: #4f46e5; border-color: #4f46e5; }
                .btn-primary { padding: 0.5rem 1rem; background-color: #4f46e5; color: white; border-radius: 0.375rem; }
                .btn-primary:hover { background-color: #4338ca; }
                .btn-secondary { padding: 0.5rem 1rem; background-color: #e5e7eb; color: #1f2937; border-radius: 0.375rem; }
                .btn-secondary:hover { background-color: #d1d5db; }
            `}</style>
        </div>
    );
}

export default TagihanFormModal;
