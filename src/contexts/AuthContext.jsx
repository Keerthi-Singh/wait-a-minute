import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  auth,
  db,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logout as firebaseLogout,
  reloadCurrentUser,
  ensureUserDocument,
  sendPasswordReset,
  sendVerificationEmail
} from '../firebase/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userUnsub = null;

    // Subscribe to Firebase Auth
    const unsub = onAuthStateChanged(auth, async (u) => {
      // Show loading while we figure out who this is
      setLoading(true);

      if (userUnsub) {
        userUnsub();
        userUnsub = null;
      }

      if (u && !u.isAnonymous) {
        setUser(u);

        // Ensure user document exists (sets student if new)
        try {
          await ensureUserDocument(u.uid, u.email);
        } catch (err) {
          console.warn('ensureUserDocument failed:', err);
        }

        // Setup real-time listener for the role
        const userRef = doc(db, 'users', u.uid);
        userUnsub = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setRole(data.role || 'student');
          } else {
            setRole('student');
          }
          // Only stop loading ONCE we have the role and data
          setLoading(false);
        }, (err) => {
          console.error("Role listener error:", err);
          setRole('student');
          setLoading(false);
        });
      } else {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      unsub();
      if (userUnsub) userUnsub();
    };
  }, []);

  const login = (email, password) => loginWithEmail(email, password);
  const register = (email, password) => registerWithEmail(email, password);
  const loginGoogle = () => loginWithGoogle();
  const logout = () => {
    setUser(null);
    setRole(null);
    return firebaseLogout();
  };
  const resetPassword = (email) => sendPasswordReset(email);
  const sendEmailVerificationToUser = () => sendVerificationEmail();
  
  const checkLimit = () => true;

  const refreshUser = async () => {
    const u = await reloadCurrentUser();
    setUser(u);
    return u;
  };

  return (
    <AuthContext.Provider value={{
      user, role, loading,
      login, register, loginGoogle, logout, resetPassword,
      sendEmailVerificationToUser, refreshUser,
      checkLimit
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
