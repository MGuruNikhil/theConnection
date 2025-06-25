import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager } from "firebase/firestore";

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
// Initialize auth with persistence
await setPersistence(auth, browserLocalPersistence);

// Initialize Firestore with persistence
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager()
  })
});

export { db };
export const storage = getStorage(app);