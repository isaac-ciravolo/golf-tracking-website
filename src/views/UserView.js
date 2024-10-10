import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import OverviewView from "./OverviewView.js";
import DrivingView from "./DrivingView.js";
import ApproachView from "./ApproachView.js";
import GreenView from "./GreenView.js";
import CardView from "./CardView.js";
import AdvancedView from "./AdvancedView.js";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Button,
  ToggleButton,
} from "@mui/material";
import { db } from "../firebase.js"; // Import Firestore config
import { collection, getDocs } from "firebase/firestore";
const UserView = () => {
  const { userId } = useParams();
  const [value, setValue] = useState(0);
  const [currentHoles, setCurrentHoles] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
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

  useEffect(() => {
    if (data[userId]) setSelectedGames(data[userId]);
  }, [data, userId]);

  useEffect(() => {
    const newHoles = [];
    selectedGames.forEach((game) => {
      game.holes.forEach((hole) => {
        newHoles.push(hole);
      });
    });
    setCurrentHoles(newHoles);
  }, [selectedGames]);

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <Box
        sx={{
          width: "200px",
          height: "100vh",
          backgroundColor: "lightGray",
          position: "fixed",
          paddingTop: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography textAlign="center" fontWeight={"bold"}>
          Select Games
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "90%",
            overflow: "scroll",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            sx={{ width: "90%", height: "48.5px" }}
            onClick={() => setSelectedGames(data[userId])}
          >
            Select All
          </Button>
          <Button
            variant="contained"
            sx={{ width: "90%", height: "48.5px" }}
            onClick={() => setSelectedGames([])}
          >
            Deselect All
          </Button>
          {data[userId] &&
            data[userId].map((game) => (
              <Box
                key={game.id}
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ToggleButton
                  color="primary"
                  value={selectedGames.includes(game)}
                  selected={selectedGames.includes(game)}
                  onClick={() => {
                    if (selectedGames.includes(game)) {
                      setSelectedGames(selectedGames.filter((g) => g !== game));
                    } else {
                      setSelectedGames([...selectedGames, game]);
                    }
                  }}
                  sx={{ width: "90%" }}
                >
                  {game.title}
                </ToggleButton>
              </Box>
            ))}
        </Box>
      </Box>
      <Box sx={{ width: "200px", height: "100%" }}></Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            width: "100%",
            height: "130px",
            backgroundColor: "rgb(240, 240, 240)",
            zIndex: 10,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h3" fontWeight="bold">
                {users[userId] && users[userId].name.toUpperCase()}
                {" (" + selectedGames.length} Games Selected)
              </Typography>
            </Box>
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
        </Box>
        <Box sx={{ marginTop: "130px" }}>
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
          >
            <GreenView currentHoles={currentHoles} />
          </Box>
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
        </Box>
      </Box>
    </Box>
  );
};

export default UserView;
