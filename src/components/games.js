import React, { useEffect, useState } from "react";
import { db } from "../firebase.js"; // import Firestore config
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

const FirestoreGames = () => {
  const [games, setGames] = useState([]);
  
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const allGames = [];
        
        // List of document IDs (e.g., user IDs or game IDs)
        // const documentIds = ["id1", "id2", "id3"]; // Replace with your document IDs
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);

        for (const docId of usersSnapshot) {
          // Reference to the document (e.g., user document)
          const userDocRef = doc(db, "users", docId);  // Assuming "users" collection
          
          // Get the document to check if it exists
          const userDocSnapshot = await getDoc(userDocRef);
          
          if (userDocSnapshot.exists()) {
            // Access the "games" subcollection for each document
            const gamesCollectionRef = collection(userDocRef, "games");
            const gamesSnapshot = await getDocs(gamesCollectionRef);
            
            gamesSnapshot.forEach((gameDoc) => {
              allGames.push({ id: gameDoc.id, ...gameDoc.data(), userId: docId });
            });
          } else {
            console.log(`Document with ID ${docId} does not exist.`);
          }
        }

        setGames(allGames);  // Set the state with all the fetched games
      } catch (error) {
        console.error("Error fetching games: ", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div>
      <h1>Games List</h1>
      <ul>
        {games.map((game) => (
          <li key={game.id}>{game.title}</li>  /* Display the title, or "Untitled Game" if no title */
        ))}
      </ul>
    </div>
  );
};

export default FirestoreGames;
