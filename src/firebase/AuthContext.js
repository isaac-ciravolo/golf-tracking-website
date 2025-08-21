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
  const [authUser, setAuthUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userVerified, setUserVerified] = useState(false);
  const [isCoach, setIsCoach] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!loading) {
      handleNavigation();
    }
  }, [userLoggedIn, loading, location.pathname]);

  const handleNavigation = () => {
    if (!userLoggedIn) {
      if (
        location.pathname !== "/login" &&
        location.pathname !== "/signup" &&
        location.pathname !== "/forgotpassword"
      ) {
        navigate("/login");
      }
    } else if (!userVerified) {
      if (
        location.pathname !== "/verify" &&
        location.pathname !== "/login" &&
        location.pathname !== "/signup" &&
        location.pathname !== "/forgotpassword"
      ) {
        navigate("/verify");
      }
    } else {
      if (location.pathname === "/verify") {
        navigate("/home");
      }
    }
  };

  const initializeUser = async (user) => {
    setLoading(true);

    if (user) {
      setUserLoggedIn(true);
      setAuthUser(user);
      if (user.emailVerified) {
        setUserVerified(true);
        let isUser = false;
        let isCoach = false;

        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setCurrentUser({ ...userData });
            setIsCoach(false);

            isUser = true;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        if (!isUser) {
          try {
            const coachDocRef = doc(db, "coaches", user.uid);
            const coachDocSnap = await getDoc(coachDocRef);

            if (coachDocSnap.exists()) {
              const coachData = coachDocSnap.data();
              setCurrentUser({ ...coachData });
              setIsCoach(true);

              isCoach = true;
            }
          } catch (error) {
            console.error("Error fetching coach data:", error);
          }
        }

        if (!isUser && !isCoach) {
          setCurrentUser(null);
        }
      } else {
        setUserVerified(false);
        setCurrentUser(null);
      }
    } else {
      setUserLoggedIn(false);
      setAuthUser(null);
      setUserVerified(false);
      setCurrentUser(null);
    }

    setLoading(false);
  };

  const value = {
    authUser,
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
