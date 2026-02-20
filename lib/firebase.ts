
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { UserStats } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForInfrastructureSetup",
  authDomain: "lumina-quest.firebaseapp.com",
  projectId: "lumina-quest",
  storageBucket: "lumina-quest.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return result.user;
  } catch (error) {
    console.error("Facebook login error:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

export const reconcileStats = (local: UserStats, cloud: UserStats): UserStats => {
  if (cloud.level > local.level) return cloud;
  if (local.level > cloud.level) return local;
  return {
    ...local,
    coins: Math.max(local.coins, cloud.coins),
    stars: Math.max(local.stars, cloud.stars),
    hearts: local.hearts,
    hintsFreeze: Math.max(local.hintsFreeze, cloud.hintsFreeze),
    hintsReveal: Math.max(local.hintsReveal, cloud.hintsReveal),
  };
};

/**
 * Kullanıcı verilerini ve liderlik tablosu skorunu senkronize et
 */
export const syncUserStats = async (uid: string, stats: UserStats, displayName: string, photoURL: string): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", uid);
    const score = (stats.level * 1000) + (stats.stars * 50) + Math.floor(stats.coins / 10);
    
    // Batch işlemine gerek yok, setDoc merge yeterli
    await setDoc(userDocRef, { ...stats, updatedAt: Date.now() }, { merge: true });
    
    // Liderlik tablosu güncelleme
    const leaderRef = doc(db, "leaderboard", uid);
    await setDoc(leaderRef, {
      name: displayName || "Gezgin",
      score: score,
      photo: photoURL || "",
      level: stats.level,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (error) {
    console.debug("Sync failed or offline");
  }
};

export const fetchCloudStats = async (uid: string): Promise<UserStats | null> => {
  try {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserStats;
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
  return null;
};
