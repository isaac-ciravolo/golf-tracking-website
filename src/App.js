import React, { useState, useEffect } from "react";
import Header from "./components/header.js";
import "./styles.css";
import { createTheme, ThemeProvider, CircularProgress } from "@mui/material";
import { db } from "./firebase.js"; // Import Firestore config
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import UserView from "./views/UserView.js";
import LoadingView from "./views/LoadingView.js";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/login.js";
import Register from "./components/register.js";
import Profile from "./components/profile.js";
import { auth } from "./firebase";

const theme = createTheme({
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 4,
      },
    },
  },
});

function App() {
  const [games, setGames] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      auth.onAuthStateChanged(async (user) => {
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

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Header />
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
              user.name ? (
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
