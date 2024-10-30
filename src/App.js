import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./styles.css";

import { createTheme, ThemeProvider } from "@mui/material";

import Header from "./components/header.js";
import UserView from "./views/UserView.js";
import LoadingView from "./views/LoadingView.js";
import Login from "./components/login.js";
import Register from "./components/register.js";

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
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          setUser(null);
          return;
        }
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          console.log("User is not logged in");
        }
      });
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user || !user.id) return;
    const fetchGames = async () => {
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
    };

    fetchGames();
  }, [user]);

  const logOut = () => {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        console.log("User signed out successfully.");
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
            element={user ? <Navigate to="/profile" /> : <Login />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              user && user.name ? (
                <UserView user={user} games={games} />
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
