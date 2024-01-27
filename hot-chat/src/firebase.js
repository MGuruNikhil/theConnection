import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDKT5CYKYiK-S4_0Iz3nS89X-HO9SAxIMM",
  authDomain: "hotchat-nik.firebaseapp.com",
  projectId: "hotchat-nik",
  storageBucket: "hotchat-nik.appspot.com",
  messagingSenderId: "1037490090996",
  appId: "1:1037490090996:web:840a77ca0dcf3dfb21bfa1",
  measurementId: "G-6P0JHL2BPD"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
