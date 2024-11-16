import React, { useState, useEffect } from "react";
import OverviewView from "./OverviewView.js";
import DrivingView from "./DrivingView.js";
import ApproachView from "./ApproachView.js";
import GreenView from "./GreenView.js";
import CardView from "./CardView.js";
import AdvancedView from "./AdvancedView.js";
import ClassesView from "./ClassesView.js";
import InputGameView from "./InputGameView.js";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Button,
  ToggleButton,
} from "@mui/material";
import formatDateFromMilliseconds from "../util/DateConverter.js";
import { listenToGames } from "../DatabaseFunctions.js";

const UserView = ({ user }) => {
  const [games, setGames] = useState([]);
  const [value, setValue] = useState(0);
  const [currentHoles, setCurrentHoles] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);

  useEffect(() => {
    if (games) setSelectedGames(games);
  }, [games]);

  useEffect(() => {
    if (user && user.id) {
      let unsubscribe;

      const fetchData = async () => {
        unsubscribe = await listenToGames(user.id, setGames);
      };

      fetchData();

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [user]);

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
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: "200px",
          height: "100%",
          backgroundColor: "lightGray",
          position: "fixed",
          paddingTop: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          zIndex: 100,
        }}
      >
        <Typography textAlign="center" fontWeight={"bold"}>
          Select Games
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            sx={{ width: "90%", height: "48.5px" }}
            onClick={() => setSelectedGames(games)}
          >
            ALL ROUNDS
          </Button>
          <Button
            variant="contained"
            sx={{ width: "90%", height: "48.5px" }}
            onClick={() => setSelectedGames([])}
          >
            DESELECT ALL
          </Button>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "center",
              width: "100%",
              overflow: "scroll",
              flexGrow: 1,
            }}
          >
            {games.length &&
              games.map((game) => (
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
                        setSelectedGames(
                          selectedGames.filter((g) => g !== game)
                        );
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
          <Button
            variant="contained"
            sx={{ width: "90%", height: "48.5px" }}
            onClick={() => setSelectedGames(games)}
          >
            ADD / EDIT ROUNDS
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          marginLeft: "200px",
          position: "relative",
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
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <Typography variant="h3" fontWeight="bold">
                {user.name && user.name.toUpperCase()}
              </Typography>
              <Typography color="gray" fontWeight={"bold"} variant="h4">
                {selectedGames.length === 1
                  ? selectedGames[0].title +
                    " - " +
                    formatDateFromMilliseconds(selectedGames[0].gameDate)
                  : +selectedGames.length + " Games Selected"}
              </Typography>
            </Box>
            <Tabs
              value={value}
              onChange={(event, newValue) => setValue(newValue)}
            >
              <Tab label="Overview" index={0} />
              <Tab label="Tee Shot" index={1} />
              <Tab label="Approach" index={2} />
              <Tab label="Putting" index={3} />
              <Tab label="Card" index={4} />
              <Tab label="Classes" index={6} />
              <Tab label="Add Round" index={7} />
            </Tabs>
          </Box>
        </Box>
        <Box sx={{ marginTop: "130px", width: "1200px" }}>
          <Box
            sx={{
              width: "100%",
              p: 3,
              ...(value !== 0 && { display: "none" }),
            }}
          >
            <OverviewView
              currentHoles={currentHoles}
              numGames={selectedGames.length}
            />
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
            <GreenView
              currentHoles={currentHoles}
              numGames={selectedGames.length}
            />
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
          <Box
            sx={{
              width: "100%",
              p: 3,
              ...(value !== 6 && { display: "none" }),
            }}
          >
            <ClassesView
              userId={user.id}
              userName={user.name}
              classes={user.classes}
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              p: 3,
              ...(value !== 7 && { display: "none" }),
            }}
          >
            <InputGameView userId={user.id} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserView;
