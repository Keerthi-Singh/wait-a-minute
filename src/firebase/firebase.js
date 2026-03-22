// Firebase initialization and helpers
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp, increment } from 'firebase/firestore';
import { getDocs, query, orderBy, deleteDoc } from 'firebase/firestore';
import { sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCc_O5Nh-j7NKlHkCVsWKCJDMbPCCvIJlo",
  authDomain: "wait-a-minute-fa18f.firebaseapp.com",
  projectId: "wait-a-minute-fa18f",
  storageBucket: "wait-a-minute-fa18f.firebasestorage.app",
  messagingSenderId: "604646749805",
  appId: "1:604646749805:web:83ac2bcd67318d27313164",
  measurementId: "G-0RYJJ3WBFR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth state changes are handled by AuthContext via onAuthStateChanged

// Helper that returns a Promise resolving to the current user (or null)
export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
};

// Helper to increment a stat counter in stats/counters document
const incrementStat = async (field, amount = 1) => {
  try {
    const statsRef = doc(db, 'stats', 'counters');
    await setDoc(statsRef, { [field]: increment(amount), lastUpdated: serverTimestamp() }, { merge: true });
  } catch (e) {
    console.warn('Could not update stats counter:', e.message);
  }
};

// Helper to save a resume under users/{uid}/resumes
export const saveResumeForUser = async (uid, resume, meta = {}) => {
  if (!uid) throw new Error('No uid provided');
  const colRef = collection(db, 'users', uid, 'resumes');
  const payload = {
    ...resume,
    meta,
    createdAt: serverTimestamp()
  };
  const docRef = await addDoc(colRef, payload);
  await incrementStat('totalResumes');
  return docRef.id;
};

// Helper to save an analysis under users/{uid}/analyses
export const saveAnalysisForUser = async (uid, analysis) => {
  if (!uid) throw new Error('No uid provided');
  const colRef = collection(db, 'users', uid, 'analyses');
  const payload = {
    ...analysis,
    createdAt: serverTimestamp()
  };
  const docRef = await addDoc(colRef, payload);
  // Increment global stats counters
  await incrementStat('totalAnalyses');
  if (analysis.type === 'intelligence_lab') {
    await incrementStat('totalIntelligenceScans');
  } else if (analysis.type === 'readiness_check') {
    await incrementStat('totalReadinessChecks');
  } else {
    await incrementStat('totalCareerAnalyses');
  }
  return docRef.id;
};

// Delete an analysis
export const deleteAnalysisForUser = async (uid, analysisId) => {
  if (!uid || !analysisId) throw new Error('Missing uid or analysisId');
  const docRef = doc(db, 'users', uid, 'analyses', analysisId);
  await deleteDoc(docRef);
  await incrementStat('totalAnalyses', -1);
};

// Rename an analysis
export const renameAnalysisForUser = async (uid, analysisId, newName) => {
  if (!uid || !analysisId) throw new Error('Missing uid or analysisId');
  const docRef = doc(db, 'users', uid, 'analyses', analysisId);
  await setDoc(docRef, { name: newName }, { merge: true });
};

// Ensure top-level user document exists
export const ensureUserDocument = async (uid, email) => {
  if (!uid) return;
  const { getDoc } = await import('firebase/firestore');
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    // New user: set default role as student
    await setDoc(userRef, {
      email: email || null,
      role: 'student',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } else {
    // Existing user: just update email if missing and timestamp
    await setDoc(userRef, {
      email: email || snap.data().email,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
};

// Fetch user role
export const getUserDocument = async (uid) => {
  if (!uid) return null;
  const { getDoc } = await import('firebase/firestore');
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) return snap.data();
  return null;
};

// Create a user with a specific role (for signup)
export const createUserProfile = async (uid, data) => {
  if (!uid) return;
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
};

// Real-time listener for analyses collection for a user
export const listenToAnalyses = (uid, onUpdate, onError) => {
  if (!uid) return () => { };
  const colRef = collection(db, 'users', uid, 'analyses');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const unsub = onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    onUpdate(items);
  }, (err) => {
    if (onError) onError(err);
  });
  return unsub;
};

// List resumes for a user (returns array of { id, data })
export const getResumesForUser = async (uid) => {
  if (!uid) throw new Error('No uid provided');
  const colRef = collection(db, 'users', uid, 'resumes');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const deleteResumeForUser = async (uid, resumeId) => {
  if (!uid) throw new Error('No uid provided');
  const docRef = doc(db, 'users', uid, 'resumes', resumeId);
  await deleteDoc(docRef);
  await incrementStat('totalResumes', -1);
};


export { app, auth, db, incrementStat };

// Authentication helpers
export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const registerWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};
export const logout = () => signOut(auth);

// Send a password reset email to the provided address
export const sendPasswordReset = (email) => sendPasswordResetEmail(auth, email);

// Send an email verification to the currently signed-in user
export const sendVerificationEmail = () => {
  const user = auth.currentUser;
  if (!user) return Promise.reject(new Error('No authenticated user to send verification to'));
  return sendEmailVerification(user);
};

// Reload the current user and return it (useful to refresh emailVerified)
export const reloadCurrentUser = async () => {
  if (auth.currentUser && typeof auth.currentUser.reload === 'function') {
    await auth.currentUser.reload();
    return auth.currentUser;
  }
  return null;
};
