import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, where, getDocs, query, limit } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyAATic12G6uyT05DVc8JL0s4EFw4VN4OL8",
    authDomain: "techstack-fc525.firebaseapp.com",
    projectId: "techstack-fc525",
    storageBucket: "techstack-fc525.appspot.com",
    messagingSenderId: "352780656449",
    appId: "1:352780656449:web:8cdc34f1f932e1d3c28bc0",
    measurementId: "G-TN27K9GGGM"
};


function createFirebaseApp(config: any) {
    try {
      return getApp();
    } catch {
      return initializeApp(config);
    }
  }

const firebaseApp = createFirebaseApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);