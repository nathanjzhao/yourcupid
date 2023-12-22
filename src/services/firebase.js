// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzBiUmef9FpsVdNhA_beSwb9sA33q1-Io",
  authDomain: "cupid-21921.firebaseapp.com",
  projectId: "cupid-21921",
  storageBucket: "cupid-21921.appspot.com",
  messagingSenderId: "817721305994",
  appId: "1:817721305994:web:82b86bbcdf180be40f3673",
  measurementId: "G-7Z7NHQ6WBK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(); // get authentication
const db = getFirestore(); // upload files

export { app, auth, db }