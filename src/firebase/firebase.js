import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const readEnv = (key) => {
  const raw = process.env[key];
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
};

const firebaseConfig = {
  apiKey: readEnv("REACT_APP_FIREBASE_API_KEY"),
  authDomain: readEnv("REACT_APP_FIREBASE_AUTH_DOMAIN"),
  projectId: readEnv("REACT_APP_FIREBASE_PROJECT_ID"),
  storageBucket: readEnv("REACT_APP_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: readEnv("REACT_APP_FIREBASE_MESSAGING_SENDER_ID"),
  appId: readEnv("REACT_APP_FIREBASE_APP_ID"),
  measurementId: readEnv("REACT_APP_FIREBASE_MEASUREMENT_ID"),
};

const requiredFirebaseKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];
const missingFirebaseKeys = requiredFirebaseKeys.filter(
  (key) => !firebaseConfig[key],
);
if (missingFirebaseKeys.length > 0) {
  throw new Error(
    `Missing Firebase config values: ${missingFirebaseKeys.join(
      ", ",
    )}. Add REACT_APP_FIREBASE_* variables to your .env file and restart the dev server.`,
  );
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);
export default app;
