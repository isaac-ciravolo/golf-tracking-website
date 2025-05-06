// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseConfig as devConfig } from "./firebaseDev.js";
import { firebaseConfig as prodConfig } from "./firebaseProd.js";

const firebaseConfig =
  process.env.NODE_ENV === "production" ? prodConfig : devConfig;

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth();
export default app;
