import React, { useState, useEffect } from "react";
import Header from "./components/header.js";
import "./styles.css";
import { Box, Tab, Tabs, Typography, Grid2 } from "@mui/material";
import { db } from "./firebase.js"; // Import Firestore config
import { collection, getDocs } from "firebase/firestore";
import AdvancedView from "./components/AdvancedView.js";
import { CustomSelect } from "./components/CustomComponents.js";
import ParScoreBarChart from "./components/ParScoreBarChart.js";
function App() {
  const [value, setValue] = useState(0);
  const [users, setUsers] = useState({});
  const [data, setData] = useState({});
  const [selectedUserID, setSelectedUserID] = useState("-");

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
      <Grid2 spacing={1} container>
        <Header />
        <div style={{ height: "100px" }}></div>
        <ParScoreBarChart />
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: 500 }}>
            <CustomSelect
              name={"Select User"}
              onChange={(e) => {
                Object.keys(data).forEach((userId) => {
                  if (users[userId].name === e.target.value) {
                    setSelectedUserID(userId);
                  }
                });
              }}
              defaultValue={selectedUserID}
              options={[
                { value: "-", label: "-" }, // Placeholder option
                ...Object.keys(users).map((userId) => {
                  return {
                    value: users[userId].name,
                    label: users[userId].name,
                  };
                }),
              ]}
            />
          </Box>
        </Box>
        {selectedUserID !== "-" && (
          <>
            <Typography
              sx={{ width: "100%" }}
              textAlign="center"
              variant="h1"
              fontWeight={"bold"}
            >
              {selectedUserID !== "-" && users[selectedUserID].name}
            </Typography>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Tabs
                value={value}
                onChange={(event, newValue) => setValue(newValue)}
              >
                <Tab label="Overview" index={0} />
                <Tab label="Tee Shot" index={1} />
                <Tab label="Approach" index={2} />
                <Tab label="Short Game" index={3} />
                <Tab label="Advanced" index={4} />
              </Tabs>
            </Box>
            {value === 4 && (
              <AdvancedView
                userData={users[selectedUserID]}
                gameData={data[selectedUserID]}
              />
            )}
          </>
        )}
      </Grid2>
    </div>
  );
}

export default App;
