import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDRpnQNgXcRpr1TDBFhmA2eP-2D7ANVJ_o",
  authDomain: "web-app-5e13f.firebaseapp.com",
  projectId: "web-app-5e13f",
  storageBucket: "web-app-5e13f.appspot.com",
  messagingSenderId: "1059875359492",
  appId: "1:1059875359492:web:993c18589fb6ef151b9e51",
  measurementId: "G-S526CTD1E2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service (db)
export const db = getFirestore(app);

// Get a reference to Firebase Cloud Storage service
export const storage = getStorage(app);

// Get a reference to the Firebase auth object
export const auth = getAuth();