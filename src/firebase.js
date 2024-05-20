import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB,
  authDomain: "hotchat-nik.firebaseapp.com",
  projectId: "hotchat-nik",
  storageBucket: "hotchat-nik.appspot.com",
  messagingSenderId: "1037490090996",
  appId: "1:1037490090996:web:840a77ca0dcf3dfb21bfa1",
  measurementId: "G-6P0JHL2BPD"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);