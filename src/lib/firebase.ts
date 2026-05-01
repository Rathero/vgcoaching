import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAV3-HCIVJIqNTWOUmO1wj1BBsfTcOOHUM",
  authDomain: "videogamecoaching-a4794.firebaseapp.com",
  projectId: "videogamecoaching-a4794",
  storageBucket: "videogamecoaching-a4794.firebasestorage.app",
  messagingSenderId: "266704815891",
  appId: "1:266704815891:web:b85c15bce443f9e7eafce6",
  measurementId: "G-9Z7Y0QLRY9",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
