import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase";

export function onAuthChanged(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split("@")[0] || "User",
      });
    } else {
      callback(null);
    }
  });
}

export async function signIn(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  return {
    uid: credential.user.uid,
    email: credential.user.email,
    displayName:
      credential.user.displayName ||
      credential.user.email?.split("@")[0] ||
      "User",
  };
}

export async function signOut() {
  await firebaseSignOut(auth);
}
