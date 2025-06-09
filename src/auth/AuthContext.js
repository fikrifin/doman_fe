import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);
    // --- PERUBAHAN 1: State baru untuk loading global ---
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Efek ini sekarang akan menangani validasi token saat aplikasi dimuat
    useEffect(() => {
        const validateTokenAndFetchUser = async () => {
            const storedToken = localStorage.getItem('authToken');
            if (storedToken) {
                try {
                    const response = await fetch(`${API_URL}/api/auth/user/`, {
                        headers: { 'Authorization': `Token ${storedToken}` },
                    });
                    if (!response.ok) {
                        throw new Error('Token tidak valid, sesi berakhir.');
                    }
                    const userData = await response.json();
                    setUser(userData);
                    setToken(storedToken); // Pastikan state token sinkron
                } catch (error) {
                    console.error(error.message);
                    // Hapus token yang tidak valid dari penyimpanan
                    localStorage.removeItem('authToken');
                    setToken(null);
                    setUser(null);
                } finally {
                    // --- PERUBAHAN 2: Hentikan loading setelah semua selesai ---
                    setLoading(false);
                }
            } else {
                // Jika tidak ada token sama sekali, langsung hentikan loading
                setLoading(false);
            }
        };

        validateTokenAndFetchUser();
    }, []); // <-- Dijalankan hanya sekali saat komponen pertama kali dimuat

    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.non_field_errors?.[0] || 'Login gagal.');
            }
            // Simpan token ke localStorage dan state, lalu fetch user
            localStorage.setItem('authToken', data.key);
            setToken(data.key);
            // Setelah login, data user akan otomatis di-fetch oleh useEffect yang lain jika diperlukan
            // atau kita bisa langsung set user di sini jika API login mengembalikannya
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    
    const logout = async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
            });
        } catch (error) {
            console.error("Gagal menghubungi server untuk logout:", error);
        } finally {
            localStorage.removeItem('authToken');
            setToken(null);
            setUser(null);
            navigate('/');
        }
    };

    // --- PERUBAHAN 3: Tambahkan 'loading' ke dalam value ---
    const value = { token, user, loading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
