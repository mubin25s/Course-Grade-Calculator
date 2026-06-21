// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAo52gki3epSZJggjr4_OMxktQQvlw6raM",
  authDomain: "course-grade-calculator-25s.firebaseapp.com",
  projectId: "course-grade-calculator-25s",
  storageBucket: "course-grade-calculator-25s.firebasestorage.app",
  messagingSenderId: "892249180461",
  appId: "1:892249180461:web:82a3269744265d7312aba4",
  measurementId: "G-TX7DC2LJCQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
