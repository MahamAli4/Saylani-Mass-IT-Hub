import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);
    }, []);

    const signup = async (userData) => {
        const { data } = await axios.post('/api/auth/signup', userData);
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const login = async (userData) => {
        const { data } = await axios.post('/api/auth/login', userData);
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
