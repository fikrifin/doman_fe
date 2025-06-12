import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    // Fungsi untuk mengambil notifikasi
    const fetchNotifications = async (authToken) => {
        if (!authToken) return;
        try {
            const response = await fetch(`${API_URL}/api/doman/checklist/notifikasi-jatuh-tempo/`, {
                headers: { 'Authorization': `Token ${authToken}` },
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Gagal memuat notifikasi:", error);
        }
    };

    // Validasi token dan ambil data awal
    useEffect(() => {
        const validateTokenAndFetchData = async () => {
            const storedToken = localStorage.getItem('authToken');
            if (storedToken) {
                try {
                    const [userResponse, notifResponse] = await Promise.all([
                        fetch(`${API_URL}/api/auth/user/`, { headers: { 'Authorization': `Token ${storedToken}` } }),
                        fetch(`${API_URL}/api/doman/checklist/notifikasi-jatuh-tempo/`, { headers: { 'Authorization': `Token ${storedToken}` } })
                    ]);

                    if (!userResponse.ok) throw new Error('Token tidak valid');
                    
                    setUser(await userResponse.json());
                    if(notifResponse.ok) setNotifications(await notifResponse.json());
                    
                    setToken(storedToken);
                } catch (error) {
                    localStorage.removeItem('authToken');
                    setToken(null);
                    setUser(null);
                    setNotifications([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        validateTokenAndFetchData();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.non_field_errors?.[0] || 'Login gagal.');
            
            localStorage.setItem('authToken', data.key);
            setToken(data.key);
            navigate('/dashboard');
        } catch (error) {
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
            console.error("Gagal logout:", error);
        } finally {
            localStorage.removeItem('authToken');
            setToken(null);
            setUser(null);
            setNotifications([]);
            navigate('/');
        }
    };

    const value = { token, user, loading, notifications, fetchNotifications, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
