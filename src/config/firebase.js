import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "aromaflow.firebaseapp.com",
  projectId: "aromaflow",
  storageBucket: "aromaflow.firebasestorage.app",
  messagingSenderId: "230781882869",
  appId: "1:230781882869:web:b6caba53fde14e620c10bc",
};

if (!firebaseConfig.apiKey) {
  throw new Error(
    "Set EXPO_PUBLIC_FIREBASE_API_KEY in .env.local before starting AromaFlow",
  );
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
