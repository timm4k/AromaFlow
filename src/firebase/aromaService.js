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
import { getSharedImageUri } from "../camera-media/sharedImage";

const AROMAS_COLLECTION = "aromas";

function readAroma(entry) {
  const data = entry.data();
  return { ...data, id: entry.id, imageUri: getSharedImageUri(data.imageUri) };
}

function readAromas(snapshot) {
  return snapshot.docs
    .map(readAroma)
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

  return readAroma(snap);
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
  if (
    "imageUri" in updates &&
    updates.imageUri !== "" &&
    getSharedImageUri(updates.imageUri) !== updates.imageUri
  )
    throw new Error("Only shared images or HTTPS image URLs can be saved");
  const ref = doc(db, AROMAS_COLLECTION, id);

  await updateDoc(ref, { ...updates, updatedAt: Date.now() });
}

export async function deleteAroma(id) {
  await deleteDoc(doc(db, AROMAS_COLLECTION, id));
}
