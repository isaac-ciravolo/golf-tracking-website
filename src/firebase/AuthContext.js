import React, { useContext, useEffect, useState } from "react";
import { db, auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import LoadingView from "../views/LoadingView.js";
import { useNavigate, useLocation } from "react-router-dom";
import { doSendEmailVerification } from "./auth.js";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isCoach, setIsCoach] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  const initializeUser = async (user) => {
    setLoading(true);
    if (user) {
      console.log(user);
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setCurrentUser({ ...userData });
        setUserLoggedIn(true);
        setIsCoach(false);
        setLoading(false);
        // if (
        //   !user.emailVerified &&
        //   (location.pathname !== "/verify" ||
        //     location.pathname !== "/login" ||
        //     location.pathname !== "/signup")
        // ) {
        //   navigate("/verify");
        // } else
        if (
          location.pathname === "/login" ||
          location.pathname === "/signup" ||
          location.pathname === "/forgotpassword" ||
          location.pathname === "/verify"
        )
          navigate("/home");
        return;
      }

      const coachDocRef = doc(db, "coaches", user.uid);
      const coachDocSnap = await getDoc(coachDocRef);

      if (coachDocSnap.exists()) {
        const coachData = coachDocSnap.data();
        setCurrentUser({ ...coachData });
        setUserLoggedIn(true);
        setIsCoach(true);
        setLoading(false);
        // if (
        //   !user.emailVerified &&
        //   (location.pathname !== "/verify" ||
        //     location.pathname !== "/login" ||
        //     location.pathname !== "/signup")
        // ) {
        //   navigate("/verify");
        // } else
        if (
          location.pathname === "/login" ||
          location.pathname === "/signup" ||
          location.pathname === "/forgotpassword" ||
          location.pathname === "/verify"
        )
          navigate("/home");

        return;
      }
    }
    setCurrentUser(null);
    setUserLoggedIn(false);
    setLoading(false);
    if (
      location.pathname !== "/login" &&
      location.pathname !== "/signup" &&
      location.pathname !== "/forgotpassword"
    ) {
      navigate("/login");
    }
  };

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    isCoach,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingView /> : children}
    </AuthContext.Provider>
  );
}
