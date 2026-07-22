import { createContext, useContext, useState } from 'react';
import { api, storeSession, clearSession, getStoredUser } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());

  async function register(email, password, role) {
    const data = await api('/api/auth/register', {
      method: 'POST',
      body: { email, password, role },
    });
    storeSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  }

  async function login(email, password) {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    storeSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
