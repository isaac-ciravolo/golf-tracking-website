import React, { useState, useEffect } from "react";
import Header from "./components/header.js";
import Main from "./components/Main.js";
import "./styles.css";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { db } from "./firebase.js"; // Import Firestore config
import { collection, getDocs } from "firebase/firestore";
import UserView from "./components/UserView.js";
import { CustomSelect } from "./components/CustomComponents.js";
function App() {
  const [value, setValue] = useState(0);
  const [users, setUsers] = useState({});
  const [data, setData] = useState({});
  const [selectedUser, setSelectedUser] = useState("-");

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
    <div className="App">
      <Header />
      <div style={{ height: "100px" }}></div>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "200px", marginRight: "50px" }}>
          <CustomSelect
            name={"Select User"}
            onChange={(e) => setSelectedUser(e.target.value)}
            defaultValue={selectedUser}
            options={[
              { value: "-", label: "-" }, // Placeholder option
              ...Object.keys(users).map((userId) => {
                return { value: users[userId].name, label: users[userId].name };
              }),
            ]}
          />
        </Box>
        <Tabs value={value} onChange={(event, newValue) => setValue(newValue)}>
          <Tab label="Overview" index={0} />
          <Tab label="Tee Shot" index={1} />
          <Tab label="Approach" index={2} />
          <Tab label="Short Game" index={3} />
          <Tab label="Advanced" index={4} />
        </Tabs>
      </Box>

      {value === 4 &&
        selectedUser !== "-" &&
        Object.keys(data).map((userId) => {
          if (users[userId].name !== selectedUser) return null;
          return (
            <UserView
              key={userId}
              userData={users[userId]}
              gameData={data[userId]}
            />
          );
        })}

      {/* <Main /> */}
    </div>
  );
}

export default App;
