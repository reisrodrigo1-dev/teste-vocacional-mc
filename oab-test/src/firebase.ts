// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFnucUA2CSyCkLPTwi290JHbuKJLgBzc4",
  authDomain: "teste-vocacional-mc.firebaseapp.com",
  projectId: "teste-vocacional-mc",
  storageBucket: "teste-vocacional-mc.firebasestorage.app",
  messagingSenderId: "654890149714",
  appId: "1:654890149714:web:1c785095b7eb5c779d7c8b",
  measurementId: "G-ZVPVTCWBZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };