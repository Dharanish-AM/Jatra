import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, fetchMe } from '../services/authApi';

const TOKEN_KEY = 'jatra_token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
    const [loading, setLoading] = useState(true);

    const persist = useCallback((newToken, newUser) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
        setUser(newUser);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
    }, []);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        fetchMe(token)
            .then(({ user: me }) => setUser(me))
            .catch(() => logout())
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (email, password) => {
        const { token: t, user: u } = await loginUser(email, password);
        persist(t, u);
    }, [persist]);

    const register = useCallback(async (name, email, password) => {
        await registerUser(name, email, password);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
