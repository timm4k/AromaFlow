import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase";

function mapUser(user) {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split("@")[0] || "User",
  };
}

export function onAuthChanged(callback) {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? mapUser(user) : null);
  });
}

export async function signIn(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  return mapUser(credential.user);
}

export async function registerUser(email, password, displayName) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }

  return mapUser(credential.user);
}

export async function signOut() {
  await firebaseSignOut(auth);
}
