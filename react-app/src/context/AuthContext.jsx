import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Start as true — will resolve quickly, but show skeleton not black screen
  const [loading, setLoading] = useState(true);

  const saveCgpaRecord = async (userId, record) => {
    try {
      const recordData = {
        cgpa: record.cgpa,
        totalCredits: record.credits || record.totalCredits || 0,
        totalPoints: record.points || record.totalPoints || 0,
        courses: record.courses || [],
        calculatorType: record.calculatorType || 'universal',
        timestamp: serverTimestamp(),
      };
      const userRecordsRef = collection(db, 'users', userId, 'records');
      await addDoc(userRecordsRef, recordData);
      return { success: true };
    } catch (error) {
      console.error('Error saving record:', error);
      return { success: false, error };
    }
  };

  const processPendingSave = async (uid) => {
    const pendingRaw = sessionStorage.getItem('pendingSaveCGPA');
    if (pendingRaw) {
      try {
        const pendingRecord = JSON.parse(pendingRaw);
        const result = await saveCgpaRecord(uid, pendingRecord);
        if (result.success) {
          sessionStorage.removeItem('pendingSaveCGPA');
          sessionStorage.setItem('justSavedPending', 'true');
        }
      } catch (err) {
        console.error('Failed to process pending save:', err);
      }
    }
  };

  const login = async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await processPendingSave(cred.user.uid);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const register = async (email, password) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await processPendingSave(cred.user.uid);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      await processPendingSave(cred.user.uid);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const setupRecaptcha = (containerId) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {},
      });
    }
  };

  const loginWithPhone = async (phoneNumber, appVerifier) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      return { success: true, confirmationResult };
    } catch (error) {
      return { success: false, error };
    }
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await processPendingSave(currentUser.uid);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    user, loading,
    login, register, loginWithGoogle,
    setupRecaptcha, loginWithPhone,
    logout, saveCgpaRecord, processPendingSave,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Always render children — loading state handled by AppLoader in App.jsx */}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
