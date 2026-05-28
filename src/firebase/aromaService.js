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

export function subscribePublicAromas(onData, onError) {
  const q = query(
    collection(db, AROMAS_COLLECTION),
    where("visibility", "==", "public"),
  );

  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    console.log(
      `[subscribePublicAromas] received ${list.length} docs`,
    );
    onData(list);
  }, onError);
}

export function subscribeMyAromas(ownerId, onData, onError) {
  const q = query(
    collection(db, AROMAS_COLLECTION),
    where("ownerId", "==", ownerId),
  );

  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    console.log(
      `[subscribeMyAromas] ownerId=${ownerId}, received ${list.length} docs`,
    );
    onData(list);
  }, onError);
}

export function subscribeAromaById(id, onData, onError) {
  return onSnapshot(
    doc(db, AROMAS_COLLECTION, id),
    (snap) => {
      if (snap.exists()) {
        onData({ id: snap.id, ...snap.data() });
      } else {
        onData(null);
      }
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

  console.log(`[addAroma] created doc ${ref.id}`, data);

  return { id: ref.id, ...data };
}

export async function updateAroma(id, updates) {
  const ref = doc(db, AROMAS_COLLECTION, id);

  await updateDoc(ref, { ...updates, updatedAt: Date.now() });
}

export async function deleteAroma(id) {
  await deleteDoc(doc(db, AROMAS_COLLECTION, id));
}
