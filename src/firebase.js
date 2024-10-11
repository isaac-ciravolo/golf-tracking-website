// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4py9cu8YK-9ZLVnW1bnhJkfMvdQBIWao",
  authDomain: "practicumproject-1373d.firebaseapp.com",
  projectId: "practicumproject-1373d",
  storageBucket: "practicumproject-1373d.appspot.com",
  messagingSenderId: "78714958107",
  appId: "1:78714958107:web:8247d4268591e30c1b63be",
  measurementId: "G-VF8R2JV2G3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
