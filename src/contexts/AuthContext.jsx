import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, getCurrentUser, loginWithEmail, registerWithEmail, loginWithGoogle, logout as firebaseLogout, sendPasswordReset, sendVerificationEmail, reloadCurrentUser } from '../firebase/firebase';
import { ensureUserDocument } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      // ensure the user's document exists in Firestore for persistence
      if (u && u.uid) {
        try {
          ensureUserDocument(u.uid, u.email).catch(err => console.warn('ensureUserDocument failed', err));
        } catch (err) {
          console.warn('ensureUserDocument call error', err);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = (email, password) => loginWithEmail(email, password);
  const register = (email, password) => registerWithEmail(email, password);
  const loginGoogle = () => loginWithGoogle();
  const logout = () => firebaseLogout();
  const resetPassword = (email) => sendPasswordReset(email);
  const sendEmailVerificationToUser = () => sendVerificationEmail();
  const refreshUser = async () => {
    try {
      await reloadCurrentUser();
      // after reload, update local state from auth
      setUser(auth.currentUser);
      return auth.currentUser;
    } catch (err) {
      console.warn('refreshUser error', err);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginGoogle, logout, resetPassword, sendEmailVerificationToUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
