import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAATic12G6uyT05DVc8JL0s4EFw4VN4OL8",
    authDomain: "techstack-fc525.firebaseapp.com",
    projectId: "techstack-fc525",
    storageBucket: "techstack-fc525.appspot.com",
    messagingSenderId: "352780656449",
    appId: "1:352780656449:web:8cdc34f1f932e1d3c28bc0",
    measurementId: "G-TN27K9GGGM"
};

if (!firebase.getApps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();