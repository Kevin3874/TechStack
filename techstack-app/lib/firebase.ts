import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAATic12G6uyT05DVc8JL0s4EFw4VN4OL8",
    authDomain: "techstack-fc525.firebaseapp.com",
    projectId: "techstack-fc525",
    storageBucket: "techstack-fc525.appspot.com",
    messagingSenderId: "352780656449",
    appId: "1:352780656449:web:8cdc34f1f932e1d3c28bc0",
    measurementId: "G-TN27K9GGGM"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage();