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
import OverviewView from "./components/OverviewView.js";
import DrivingView from "./components/DrivingView.js";
import ApproachView from "./components/ApproachView.js";
import CardView from "./components/CardView.js";
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

const clubsData = [
  { club: "Dr", distance: 274 },
  { club: "3w", distance: 233 },
  { club: "2h", distance: 219 },
  { club: "4i", distance: 198 },
  { club: "5i", distance: 178 },
  { club: "6i", distance: 174 },
  { club: "7i", distance: 158 },
  { club: "8i", distance: 139 },
  { club: "9i", distance: 128 },
  { club: "Pw", distance: 119 },
  { club: "52", distance: 110 },
  { club: "54", distance: 100 },
];

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
                  <Tab label="Card" index={4} />
                  <Tab label="Advanced" index={5} />
                </Tabs>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  p: 3,
                  ...(value !== 0 && { display: "none" }),
                }}
              >
                <OverviewView currentHoles={currentHoles} />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  p: 3,
                  ...(value !== 1 && { display: "none" }),
                }}
              >
                <DrivingView currentHoles={currentHoles} />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  p: 3,
                  ...(value !== 2 && { display: "none" }),
                }}
              >
                <ApproachView currentHoles={currentHoles} />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  p: 3,
                  ...(value !== 3 && { display: "none" }),
                }}
              ></Box>
              <Box
                sx={{
                  width: "100%",
                  p: 3,
                  ...(value !== 4 && { display: "none" }),
                }}
              >
                <CardView currentHoles={currentHoles} />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  p: 3,
                  ...(value !== 5 && { display: "none" }),
                }}
              >
                <AdvancedView currentHoles={currentHoles} />
              </Box>
            </>
          )}
        </Grid2>
      </ThemeProvider>
    </div>
  );
}

export default App;
