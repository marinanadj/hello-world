import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import Constants from "expo-constants";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDueaDz7lAjboRMCGm6GBXRBe-MRs5AD0Q",
    authDomain: "chatapp-7195d.firebaseapp.com",
    projectId: "chatapp-7195d",
    storageBucket: "chatapp-7195d.appspot.com",
    messagingSenderId: "35620742814",
    appId: "1:35620742814:web:0eca889e9f90a8f9ba3d8f"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service (db)
export const db = getFirestore(app);

// Get a reference to the Firebase auth object
export const auth = getAuth();