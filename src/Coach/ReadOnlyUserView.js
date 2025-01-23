import React, { useState, useEffect } from "react";
import OverviewView from "../User/OverviewView.js";
import DrivingView from "../User/DrivingView.js";
import ApproachView from "../User/ApproachView.js";
import PuttingView from "../User/PuttingView.js";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Button,
  ToggleButton,
} from "@mui/material";
import formatDateFromMilliseconds from "../util/DateConverter.js";
import { listenToGames, fetchUserById } from "../firebase/DatabaseFunctions.js";
import { useNavigate, useParams } from "react-router-dom";
import LoadingView from "../views/LoadingView.js";
import ShortGameView from "../User/ShortGameView.js";

const ReadOnlyUserView = () => {
  const [games, setGames] = useState([]);
  const [value, setValue] = useState(0);
  const [currentHoles, setCurrentHoles] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const temp = async () => {
      const user = await fetchUserById(id);
      setUser(user);
      console.log(user);
    };
    temp();
  }, [id]);

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
    if (games && games.length > 0) {
      setSelectedGames(games);
      setLoading(false);
    }
  }, [games]);

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
    <>
      {loading ? (
        <LoadingView />
      ) : (
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
                maxHeight: "calc(100% - 250px)",
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
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ReadOnlyUserView;
