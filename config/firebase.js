const firebase = require('firebase');

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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Cloud Firestore and get a reference to the service (db)
export const db = firebase.firestore();

// Get a reference to the Firebase auth object
export const auth = await firebase.auth();