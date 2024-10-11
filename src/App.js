import React, { useState, useEffect } from "react";
import Header from "./components/header.js";
import "./styles.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { db } from "./firebase.js"; // Import Firestore config
import { collection, getDocs } from "firebase/firestore";
import HomeView from "./views/HomeView.js";
import UserView from "./views/UserView.js";
import { Routes, Route } from "react-router-dom";

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
  const [users, setUsers] = useState({});
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);

        usersSnapshot.forEach(async (userDoc) => {
          const userGames = [];
          const gamesCollectionRef = collection(userDoc.ref, "games");
          const gamesSnapshot = await getDocs(gamesCollectionRef);
          setUsers((prevUsers) => ({
            ...prevUsers,
            [userDoc.id]: userDoc.data(),
          }));

          gamesSnapshot.forEach((gameDoc) => {
            userGames.push({
              id: gameDoc.id,
              ...gameDoc.data(),
              userId: userDoc.id,
            });
          });
          userGames.sort((a, b) => a.gameDate - b.gameDate);
          setData((prevData) => ({
            ...prevData,
            [userDoc.id]: userGames,
          }));
        });
      } catch (error) {
        console.error("Error fetching games: ", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Header />
        <div style={{ height: "100px" }}></div>

        <Routes>
          <Route path="/" element={<HomeView data={data} users={users} />} />
          <Route path="/user/:userId" element={<UserView />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
