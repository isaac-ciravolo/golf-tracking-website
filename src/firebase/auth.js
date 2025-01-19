import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  // result.user
  return result;
};

export const doSignOut = async () => {
  return auth.signOut();
};

export const doPasswordUpdate = async (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doPasswordReset = async (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doSendEmailVerification = async () => {
  try {
    return sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/analysis`,
    });
  } catch (error) {
    return null;
  }
};
