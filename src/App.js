import React, { useState, useEffect } from "react";
import Header from "./components/header.js";
import "./styles.css";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Grid2,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { db } from "./firebase.js"; // Import Firestore config
import { collection, getDocs } from "firebase/firestore";
import DrivingView from "./components/DrivingView.js";
import ApproachView from "./components/ApproachView.js";
import AdvancedView from "./components/AdvancedView.js";
import {
  CustomSelect,
  CustomCheckboxDropdown,
} from "./components/CustomComponents.js";

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
  const [value, setValue] = useState(0);
  const [users, setUsers] = useState({});
  const [data, setData] = useState({});
  const [selectedUserID, setSelectedUserID] = useState("-");
  const [currentHoles, setCurrentHoles] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);

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

  useEffect(() => {
    const newCurrentHoles = [];
    selectedGames.forEach((game) => {
      if (game && game.holes)
        game.holes.forEach((hole) => {
          newCurrentHoles.push(hole);
        });
    });
    setCurrentHoles(newCurrentHoles);
  }, [selectedGames]);

  useEffect(() => {
    if (data[selectedUserID]) setSelectedGames(data[selectedUserID]);
  }, [selectedUserID]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Grid2 spacing={1} container>
          <Header />
          <div style={{ height: "100px" }}></div>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                width: 500,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <CustomSelect
                name={"Select User"}
                onChange={(e) => {
                  Object.keys(data).forEach((userId) => {
                    if (userId === e.target.value) {
                      setSelectedUserID(userId);
                    }
                  });
                }}
                defaultValue={selectedUserID}
                options={[
                  { value: "-", label: "-" }, // Placeholder option
                  ...Object.keys(users).map((userId) => {
                    return {
                      value: userId,
                      label: users[userId].name,
                    };
                  }),
                ]}
              />
              {data[selectedUserID] && (
                <CustomCheckboxDropdown
                  name="Select Games"
                  items={data[selectedUserID]}
                  selectedItems={selectedGames}
                  setSelectedItems={setSelectedGames}
                  includeTop10={true}
                />
              )}
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
                  <Tab label="Driving" index={1} />
                  <Tab label="Approach" index={2} />
                  <Tab label="Green" index={3} />
                  <Tab label="Advanced" index={4} />
                </Tabs>
              </Box>
              {value === 1 && <DrivingView currentHoles={currentHoles} />}
              {value === 2 && <ApproachView currentHoles={currentHoles} />}
              {value === 4 && <AdvancedView currentHoles={currentHoles} />}
            </>
          )}
        </Grid2>
      </ThemeProvider>
    </div>
  );
}

export default App;
