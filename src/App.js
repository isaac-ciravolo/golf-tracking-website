import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./styles.css";

import { createTheme, ThemeProvider } from "@mui/material";

import Header from "./components/header.js";
import UserView from "./views/UserView.js";
import LoadingView from "./views/LoadingView.js";
import UserLoginView from "./views/UserLoginView.js";
import UserSignUpView from "./views/UserSignUpView.js";
import CoachView from "./views/CoachView.js";

import { auth } from "./firebase";
import { db } from "./firebase.js"; // Import Firestore config
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

const theme = createTheme({
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 4,
      },
    },
  },
  palette: {
    primary: {
      main: "#4E2A84", // Purple color
    },
  },
});

function App() {
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null);
  const [isCoach, setIsCoach] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          if (location.pathname !== "/login" && location.pathname !== "/signup")
            navigate("/login");
          setUser(null);
          return;
        }
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUser(userDocSnap.data());
          setIsCoach(false);
          return;
        }

        const coachDocRef = doc(db, "coaches", user.uid);
        const coachDocSnap = await getDoc(coachDocRef);

        if (coachDocSnap.exists()) {
          setUser(coachDocSnap.data());
          setIsCoach(true);
          return;
        }

        console.error("User not found in Firestore.");
        setUser(null);
        navigate("/login");
      });
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user || !user.id) return;
    const fetchGames = async () => {
      if (!isCoach) {
        const userDocRef = doc(db, "users", user.id);
        const gamesCollectionRef = collection(userDocRef, "games");
        const gamesSnapshot = await getDocs(gamesCollectionRef);
        const userGames = [];
        gamesSnapshot.forEach((gameDoc) => {
          userGames.push({
            id: gameDoc.id,
            ...gameDoc.data(),
          });
        });
        userGames.sort((a, b) => a.gameDate - b.gameDate);
        setGames(userGames);
      } else {
        const coachDocRef = doc(db, "coaches", user.id);
      }
    };

    fetchGames();
  }, [user]);

  const logOut = () => {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        navigate("/login"); // Redirect to login page
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Header showLogOut={user !== null} logOut={logOut} />
        <div style={{ height: "100px" }}></div>

        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/profile" /> : <UserLoginView />}
          />
          <Route path="/login" element={<UserLoginView />} />
          <Route path="/signup" element={<UserSignUpView />} />
          <Route
            path="/profile"
            element={
              user && user.name ? (
                isCoach ? (
                  <CoachView user={user} />
                ) : (
                  <UserView user={user} games={games} />
                )
              ) : (
                <LoadingView />
              )
            }
          />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
