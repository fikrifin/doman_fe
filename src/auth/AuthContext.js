import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    // --- PERUBAHAN 1: State baru untuk menyimpan data user ---
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Efek ini sekarang akan mengambil data user jika ada token
    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/api/auth/user/`, {
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    });
                    if (!response.ok) {
                        // Jika token tidak valid (misal: sudah expired), hapus token
                        throw new Error('Token tidak valid');
                    }
                    const userData = await response.json();
                    setUser(userData); // Simpan data user ke state
                } catch (error) {
                    console.error("Gagal mengambil data user:", error);
                    // Logout paksa jika token bermasalah
                    setToken(null);
                    setUser(null);
                    localStorage.removeItem('authToken');
                }
            } else {
                // Jika tidak ada token, pastikan user juga null
                setUser(null);
            }
        };

        fetchUser();
    }, [token]); // Jalankan setiap kali token berubah

    const login = async (username, password) => {
        // ... (Fungsi login tetap sama)
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
            // Saat login, set token. useEffect di atas akan otomatis mengambil data user.
            setToken(data.key);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    
    const logout = async () => {
        // ... (Fungsi logout tetap sama)
        try {
            await fetch(`${API_URL}/api/auth/logout/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
            });
        } catch (error) {
            console.error("Gagal menghubungi server untuk logout:", error);
        } finally {
            setToken(null);
            setUser(null); // Pastikan data user juga dibersihkan
            navigate('/');
        }
    };

    // --- PERUBAHAN 2: Tambahkan 'user' ke dalam value yang diberikan context ---
    const value = { token, user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
