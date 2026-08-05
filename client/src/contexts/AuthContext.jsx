import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('vet_ops_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('vet_ops_token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('vet_ops_token', token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('vet_ops_user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vet_ops_token');
    localStorage.removeItem('vet_ops_user');
    delete api.defaults.headers.common.Authorization;
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
