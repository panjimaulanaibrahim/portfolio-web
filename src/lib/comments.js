// Reads and adds comments in Firestore (collection "comments").
// Uses the lightweight "lite" Firestore client, loaded only when the Contact section needs it.
// Deleting a comment: Firebase console → Firestore Database → comments → pick the document → Delete.

import { getApps, initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore/lite";
import { firebaseConfig } from "@/data/firebaseConfig";

const app = getApps()[0] ?? initializeApp(firebaseConfig);
const comments = collection(getFirestore(app), "comments");

export const NAME_MAX = 40;
export const MESSAGE_MAX = 500;

export async function loadComments(max = 30) {
  const snapshot = await getDocs(query(comments, orderBy("createdAt", "desc"), limit(max)));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      message: data.message,
      createdAt: data.createdAt?.toDate?.() ?? null,
    };
  });
}

export async function postComment(name, message) {
  const ref = await addDoc(comments, { name, message, createdAt: serverTimestamp() });
  return ref.id;
}
