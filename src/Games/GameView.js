import React, { useState, useEffect } from "react";
import { listenToGames } from "../DatabaseFunctions";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditGameView from "./EditGameView";
const GameView = ({ user }) => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

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
    if (selectedGame !== null) {
      games.forEach((game) => {
        if (game.id === selectedGame) {
          setSelectedGame(game);
        }
      });
    }
  }, [games]);

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <Box
        sx={{
          width: "200px",
          height: "calc(100vh - 100px)",
          backgroundColor: "lightGray",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          zIndex: 100,
          alignItems: "center",
          p: 3,
        }}
      >
        <Button
          variant="contained"
          sx={{ width: "90%", height: "48.5px" }}
          onClick={() => {
            navigate("/analysis");
          }}
        >
          ANALYSIS
        </Button>
        <Button
          variant="contained"
          sx={{ width: "90%", height: "48.5px" }}
          onClick={() => {
            setSelectedGame(null);
          }}
        >
          GAMES LIST
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "baseline",
              }}
            >
              <Typography variant="h3" fontWeight="bold">
                {user && user.name && user.name.toUpperCase()}
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="gray">
                Edit Games
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: "100%", height: "100%" }}>
          {selectedGame === null ? (
            <Box
              sx={{
                width: "100%",
                height: "calc(100vh - 230px)",
                ...(selectedGame !== null && { display: "none" }),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  height: "100px",
                  width: "90%",
                }}
              >
                <Typography fontSize="40px" fontWeight={"bold"}>
                  Add Game
                </Typography>
              </Button>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  overflowY: "scroll",
                  overflowX: "hidden",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                }}
              >
                {games.map((game) => (
                  <Button
                    key={game.id}
                    variant="outlined"
                    sx={{
                      height: "100px",
                      width: "90%",
                      border: "5px solid",
                    }}
                    onClick={() => {
                      setSelectedGame(game);
                    }}
                  >
                    <Typography fontSize="40px" fontWeight={"bold"}>
                      {game.title}
                    </Typography>
                  </Button>
                ))}
              </Box>
            </Box>
          ) : (
            <EditGameView game={selectedGame} user={user} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GameView;
