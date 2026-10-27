import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredTokens, setStoredTokens } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [postAuthRedirectAction, setPostAuthRedirectAction] = useState(null);

  // Silent session check on initial mount
  useEffect(() => {
    async function checkExistingSession() {
      const tokens = getStoredTokens();
      if (!tokens || !tokens.access) {
        setIsLoadingAuth(false);
        return;
      }
      try {
        const userData = await api.getMe();
        setUser(userData);
      } catch (err) {
        console.warn('Initial auth check failed or token expired:', err);
        setStoredTokens(null);
        setUser(null);
      } finally {
        setIsLoadingAuth(false);
      }
    }
    checkExistingSession();
  }, []);

  const login = async (phoneOrUsername, password) => {
    const data = await api.login({ phone_or_username: phoneOrUsername, password });
    if (data.tokens) {
      setStoredTokens(data.tokens);
    }
    setUser(data.user);
    setIsAuthModalOpen(false);

    // If an action was queued (e.g. continue checkout), trigger it
    if (postAuthRedirectAction) {
      const action = postAuthRedirectAction;
      setPostAuthRedirectAction(null);
      action();
    }
    return data;
  };

  const register = async ({ name, phoneNumber, password, email }) => {
    const data = await api.register({
      name,
      phone_number: phoneNumber,
      password,
      email,
    });
    if (data.tokens) {
      setStoredTokens(data.tokens);
    }
    setUser(data.user);
    setIsAuthModalOpen(false);

    if (postAuthRedirectAction) {
      const action = postAuthRedirectAction;
      setPostAuthRedirectAction(null);
      action();
    }
    return data;
  };

  const logout = () => {
    setStoredTokens(null);
    setUser(null);
    sessionStorage.removeItem('halo_aria_session_id');
  };

  const openLoginModal = (actionAfterLogin = null) => {
    setAuthModalMode('login');
    setPostAuthRedirectAction(() => actionAfterLogin);
    setIsAuthModalOpen(true);
  };

  const openSignupModal = (actionAfterLogin = null) => {
    setAuthModalMode('signup');
    setPostAuthRedirectAction(() => actionAfterLogin);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPostAuthRedirectAction(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoadingAuth,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openLoginModal,
        openSignupModal,
        closeAuthModal,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
