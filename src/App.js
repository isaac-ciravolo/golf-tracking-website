import { collection, getDocs } from "firebase/firestore";
import {db} from './firebase';
import { useState, useEffect } from 'react';


import Header from './components/header.js';
import Button from './components/button.js';

import './styles.css';

function App() {
  const [todos, setTodos] = useState([]);

  const fetchUsersAndGames = async () => {
    try {
      // Step 1: Get all users from the 'users' collection
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      
      // Step 2: Loop through each user document
      usersSnapshot.forEach(async (userDoc) => {
        const userId = userDoc.id; // Get user ID
        const userData = userDoc.data(); // Get user data (if needed)
        
        console.log(`User: ${userId}`);
        
        // Step 3: Get the 'games' subcollection for each user
        const gamesCollection = collection(db, 'users', userId, 'games');
        const gamesSnapshot = await getDocs(gamesCollection);
        
        // Step 4: Loop through each document in the 'games' subcollection
        gamesSnapshot.forEach((gameDoc) => {
          const gameData = gameDoc.data(); // Get game data
          console.log(`Game for user ${userId}:`, gameData);
        });
      });
    } catch (error) {
      console.error("Error fetching users and games:", error);
    }
  };
  

    useEffect(()=>{
      console.log("use effect")
      fetchUsersAndGames();
    }, [])

  return (
    <div className="App">
      <Header/>
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      <hr></hr>
      <Button/>


    </div>
  );
}

export default App;
