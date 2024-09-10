import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";

import Header from "./components/header.js";
import Button from "./components/button.js";
import FirestoreGames from "./components/games.js";

import "./styles.css";


function App() {
  const [games, setGames] = useState([]);

  const fetchUsersAndGames = async () => {
    try {
      // Step 1: Get all users from the 'users' collection
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);

      // Step 2: Loop through each user document
      usersSnapshot.forEach(async (userDoc) => {
        const userId = userDoc.id; // Get user ID
        const userData = userDoc.data(); // Get user data (if needed)

        // Step 3: Get the 'games' subcollection for each user
        const gamesCollection = collection(db, "users", userId, "games");
        const gamesSnapshot = await getDocs(gamesCollection);

        // Step 4: Loop through each document in the 'games' subcollection
        const gamesList = gamesSnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setGames(gamesList);
      });
    } catch (error) {
      console.error("Error fetching users and games:", error);
    }
  };

  useEffect(() => {
    fetchUsersAndGames();
  }, []);

  useEffect(() => {
    console.log(games.length);
  }, [games]);

  return (
    <div className="App">
      <Header />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <hr></hr>
      <Button />

      <ul>
        <FirestoreGames/>
        {/* {games.map((game) => {
          return <li key={game.id}>{game.title}</li>;
        })} */}
      </ul>

      <div style={{ width: "500px" }}>
        <PieChart
          data={[
            { title: "One", value: 1, color: "#E38627" },
            { title: "Two", value: 20, color: "#C13C37" },
            { title: "Three", value: 20, color: "#6A2135" },
          ]}
        />
      </div>
    </div>
  );
}

export default App;
