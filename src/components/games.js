import React, { useEffect, useState } from "react";
import { db } from "../firebase.js"; // Import Firestore config
import { collection, getDocs } from "firebase/firestore";
import GameView from "./GameView.js";

import { Box, Typography } from "@mui/material";
import { CustomSelect } from "./CustomComponents.js";

const FirestoreGames = () => {
  const [users, setUsers] = useState({});
  const [data, setData] = useState({});
  const [selectedUser, setSelectedUser] = useState("");

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
    <Box className="games" sx={{ p: 3 }}>
      <CustomSelect
        name={"Select User"}
        onChange={(e) => setSelectedUser(e.target.value)}
        defaultValue={"-"}
        options={[
          { value: "-", label: "-" }, // Placeholder option
          ...Object.keys(users).map((userId) => {
            return { value: users[userId].name, label: users[userId].name };
          }),
        ]}
      />

      {Object.keys(data).map((userId) => {
        if (selectedUser !== "-" && users[userId].name !== selectedUser)
          return null;
        return (
          <Box sx={{ p: 3 }}>
            <Typography
              textAlign="center"
              variant="h2"
              sx={{ fontWeight: "bold" }}
            >
              {users[userId].name}
            </Typography>
            {data[userId].map((game) => {
              if (game && game.holes) return <GameView game={game} />;
              else return null;
            })}
          </Box>
        );
      })}
    </Box>
  );
};

export default FirestoreGames;
