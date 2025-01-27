import React, { useState, useEffect } from "react";
import OverviewView from "./OverviewView.js";
import DrivingView from "./DrivingView.js";
import ApproachView from "./ApproachView.js";
import PuttingView from "./PuttingView.js";
import CardView from "./CardView.js";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Button,
  ToggleButton,
  Icon,
} from "@mui/material";
import formatDateFromMilliseconds from "../util/DateConverter.js";
import { fetchGames } from "../firebase/DatabaseFunctions.js";
import { useNavigate } from "react-router-dom";
import LoadingView from "../views/LoadingView.js";
import ClassesView from "./ClassesView.js";
import ShortGameView from "./ShortGameView.js";
import { useAuth } from "../firebase/AuthContext.js";
import { validGame } from "../util/ValidChecker.js";
import WarningIcon from "@mui/icons-material/Warning";

const UserView = () => {
  const { currentUser: user } = useAuth();
  const [games, setGames] = useState([]);
  const [value, setValue] = useState(0);
  const [currentHoles, setCurrentHoles] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [selectedNineHoleGames, setSelectedNineHoleGames] = useState([]);
  const [selectedEighteenHoleGames, setSelectedEighteenHoleGames] = useState(
    []
  );
  const [currentNineHoles, setCurrentNineHoles] = useState([]);
  const [currentEighteenHoles, setCurrentEighteenHoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const newSelectedGames = [];
    const newSelectedNineHoleGames = [];
    const newSelectedEighteenHoleGames = [];
    if (games) {
      for (let i = 0; i < games.length; i++)
        if (validGame(games[i])) {
          newSelectedGames.push(games[i]);
          if (games[i].holes.length === 9)
            newSelectedNineHoleGames.push(games[i]);
          else if (games[i].holes.length === 18)
            newSelectedEighteenHoleGames.push(games[i]);
        }
      setSelectedGames(newSelectedGames);
      setSelectedNineHoleGames(newSelectedNineHoleGames);
      setSelectedEighteenHoleGames(newSelectedEighteenHoleGames);
      setLoading(false);
    }
  }, [games]);

  useEffect(() => {
    const temp = async () => {
      if (user) {
        const newGames = await fetchGames(user.id, setGames);
        setGames(newGames);
      }
    };

    temp();
  }, [user]);

  useEffect(() => {
    const newHoles = [];
    selectedGames.forEach((game) => {
      if (validGame(game))
        game.holes.forEach((hole) => {
          newHoles.push(hole);
        });
    });
    setCurrentHoles(newHoles);
  }, [selectedGames]);

  useEffect(() => {
    const newNineHoles = [];
    selectedNineHoleGames.forEach((game) => {
      if (validGame(game))
        game.holes.forEach((hole) => {
          newNineHoles.push(hole);
        });
    });
    setCurrentNineHoles(newNineHoles);
  }, [selectedNineHoleGames]);

  useEffect(() => {
    const newEighteenHoles = [];
    selectedEighteenHoleGames.forEach((game) => {
      if (validGame(game))
        game.holes.forEach((hole) => {
          newEighteenHoles.push(hole);
        });
    });
    setCurrentEighteenHoles(newEighteenHoles);
  }, [selectedEighteenHoleGames]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "200px",
            height: "100%",
            backgroundColor: "lightGray",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            p: 3,
          }}
        >
          <Typography textAlign="center" fontWeight={"bold"}>
            Select Games
          </Typography>
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
              overflowY: "auto",
              maxHeight: "calc(100% - 300px)",
            }}
          >
            {games.length ? (
              games.map((game) => (
                <Box
                  key={game.id}
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {validGame(game) ? (
                    <>
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
                    </>
                  ) : (
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => {
                        navigate("/editGames/" + game.id);
                      }}
                      sx={{
                        width: "90%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {game.title}
                      <Icon sx={{ display: "flex", alignItems: "center" }}>
                        <WarningIcon />
                      </Icon>
                    </Button>
                  )}
                </Box>
              ))
            ) : (
              <>Add a Game To Get Started!</>
            )}
          </Box>
          <Button
            variant="contained"
            sx={{ width: "90%", height: "48.5px" }}
            onClick={() => {
              navigate("/editGames");
            }}
          >
            ADD / EDIT ROUNDS
          </Button>
          <Box sx={{ width: "100%", height: "10px" }}></Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
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
                <Tab label="Short Game" index={3} />
                <Tab label="Putting" index={4} />
                <Tab label="Classes" index={5} />
              </Tabs>
            </Box>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              overflow: "auto",
              paddingTop: 3,
            }}
          >
            <Box
              sx={{
                width: "100%",
                ...(value !== 0 && { display: "none" }),
              }}
            >
              <OverviewView
                currentHoles={currentHoles}
                numGames={selectedGames.length}
                currentNineHoles={currentNineHoles}
                numNineHolesGames={selectedNineHoleGames.length}
                currentEighteenHoles={currentEighteenHoles}
                numEighteenHolesGames={selectedEighteenHoleGames.length}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                ...(value !== 1 && { display: "none" }),
              }}
            >
              <DrivingView currentHoles={currentHoles} />
            </Box>
            <Box
              sx={{
                width: "100%",
                ...(value !== 2 && { display: "none" }),
              }}
            >
              <ApproachView
                currentHoles={currentHoles}
                numGames={selectedGames.length}
                currentNineHoles={currentNineHoles}
                numNineHolesGames={selectedNineHoleGames.length}
                currentEighteenHoles={currentEighteenHoles}
                numEighteenHolesGames={selectedEighteenHoleGames.length}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                ...(value !== 3 && { display: "none" }),
              }}
            >
              <ShortGameView
                currentHoles={currentHoles}
                numGames={selectedGames.length}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                ...(value !== 4 && { display: "none" }),
              }}
            >
              <PuttingView
                currentHoles={currentHoles}
                numGames={selectedGames.length}
                currentNineHoles={currentNineHoles}
                numNineHolesGames={selectedNineHoleGames.length}
                currentEighteenHoles={currentEighteenHoles}
                numEighteenHolesGames={selectedEighteenHoleGames.length}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                ...(value !== 5 && { display: "none" }),
              }}
            >
              <ClassesView />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default UserView;
