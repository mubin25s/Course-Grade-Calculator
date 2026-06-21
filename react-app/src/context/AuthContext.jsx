import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Expose function to save a CGPA record to Firestore
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
      console.error('Error saving record to Firestore:', error);
      return { success: false, error };
    }
  };

  // Check and process any pending saved calculation in sessionStorage
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
        console.error('Failed to parse or save pending record:', err);
      }
    }
  };

  // Auth functions
  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await processPendingSave(userCredential.user.uid);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error };
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await processPendingSave(userCredential.user.uid);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error };
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Double-check pending save on state change (just in case)
        await processPendingSave(currentUser.uid);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    saveCgpaRecord,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
