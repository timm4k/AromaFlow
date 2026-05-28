import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBAPwxk21FAPvjzOEVHRLxEUxlrQrb9lvs",
  authDomain: "aromaflow.firebaseapp.com",
  projectId: "aromaflow",
  storageBucket: "aromaflow.firebasestorage.app",
  messagingSenderId: "230781882869",
  appId: "1:230781882869:web:b6caba53fde14e620c10bc",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
