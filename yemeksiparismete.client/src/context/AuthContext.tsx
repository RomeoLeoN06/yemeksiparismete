/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name?: string;
  FullName?: string;
  email: string;
  phoneNumber?: string;
  recoveryCode?: string;
  role: 'admin' | 'restaurant_owner' | 'customer' | 'courier';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (identifier: string, password?: string) => Promise<void>;
  updateUser: (newData: Partial<User>) => void;
  register: (name: string, email: string, phoneNumber: string, password?: string, role?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = '/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, [token]);

  const login = async (identifier: string, password?: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      const userObj: User = {
        id: data.user.id ?? data.user.Id,
        name: data.user.fullName ?? data.user.FullName,
        FullName: data.user.fullName ?? data.user.FullName,
        email: data.user.email ?? data.user.Email,
        phoneNumber: data.user.phoneNumber ?? data.user.PhoneNumber,
        recoveryCode: data.user.recoveryCode ?? data.user.RecoveryCode,
        role: data.user.role ?? data.user.Role
      };
      setUser(userObj);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userObj));
    } else {
      throw new Error('Giriş başarısız.');
    }
  };

  const updateUser = (newData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...newData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const register = async (name: string, email: string, phoneNumber: string, password?: string, role: string = 'customer') => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: name, email, phoneNumber, password, role })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData[0]?.description || 'Kayıt başarısız.');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, updateUser, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
