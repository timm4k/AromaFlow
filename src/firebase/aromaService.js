import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

const AROMAS_COLLECTION = "aromas";

function readAromas(snapshot) {
  return snapshot.docs
    .map((entry) => ({ id: entry.id, ...entry.data() }))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export function subscribePublicAromas(onData, onError) {
  const q = query(
    collection(db, AROMAS_COLLECTION),
    where("visibility", "==", "public"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      onData(readAromas(snapshot));
    },
    onError,
  );
}

export function subscribeMyAromas(ownerId, onData, onError) {
  const q = query(
    collection(db, AROMAS_COLLECTION),
    where("ownerId", "==", ownerId),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      onData(readAromas(snapshot));
    },
    onError,
  );
}

export async function getAromaById(id) {
  const snap = await getDoc(doc(db, AROMAS_COLLECTION, id));

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() };
}

export async function addAroma(aroma) {
  const ref = doc(collection(db, AROMAS_COLLECTION));
  const now = Date.now();

  const data = {
    ...aroma,
    createdAt: now,
    updatedAt: now,
    isCustom: true,
  };

  await setDoc(ref, data);

  return { id: ref.id, ...data };
}

export async function updateAroma(id, updates) {
  const ref = doc(db, AROMAS_COLLECTION, id);

  await updateDoc(ref, { ...updates, updatedAt: Date.now() });
}

export async function deleteAroma(id) {
  await deleteDoc(doc(db, AROMAS_COLLECTION, id));
}
