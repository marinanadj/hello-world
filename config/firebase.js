import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Constants from "expo-constants"

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAR_GK-5CLLmjwteqyY6Hs1O-6I8PGTFLY",
  authDomain: "hallo-world-1efc5.firebaseapp.com",
  projectId: "hallo-world-1efc5",
  storageBucket: "hallo-world-1efc5.appspot.com",
  messagingSenderId: "169862681225",
  appId: "1:169862681225:web:0e4d5170059057210aec58"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service (db)
export const db = getFirestore(app);

// Get a reference to the Firebase auth object
export const auth = getAuth();