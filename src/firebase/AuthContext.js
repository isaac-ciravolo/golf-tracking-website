import React, { useContext, useEffect, useState } from "react";
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import LoadingView from "../views/LoadingView.js";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchUserData } from "../database/UserFunctions.js";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
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

        const token = await auth.currentUser.getIdToken();
        const res = await fetchUserData(token);
        if (res.status !== 200) console.error(res.error);
        else {
          setUserData(res.data);
          setIsCoach(res.data.isCoach);
        }
      } else {
        setUserVerified(false);
        setUserData(null);
      }
    } else {
      setUserLoggedIn(false);
      setAuthUser(null);
      setUserVerified(false);
      setUserData(null);
    }

    setLoading(false);
  };

  const value = {
    authUser,
    userData,
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
