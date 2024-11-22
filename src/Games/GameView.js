import React, { useState, useEffect } from "react";
import { listenToGames } from "../DatabaseFunctions";
import { Box, Button, Typography, Dialog, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import EditGameView from "./EditGameView";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { addGame } from "../DatabaseFunctions";

const GameView = ({ user }) => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [gameName, setGameName] = useState("");
  const [date, setDate] = useState(null);

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
      let foundGame = false;
      games.forEach((game) => {
        if (game.id === selectedGame) {
          setSelectedGame(game);
          foundGame = true;
        }
      });
      if (!foundGame) setSelectedGame(null);
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
          ROUNDS
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
                onClick={() => {
                  setOpen(true);
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
            <EditGameView
              game={selectedGame}
              userId={user.id}
              back={() => setSelectedGame(null)}
            />
          )}
        </Box>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: "500px",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Typography variant="h3" fontWeight="bold">
            Create a Round
          </Typography>
          <TextField
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            placeholder="Enter Round"
            value={gameName}
            sx={{ width: "100%" }}
            onChange={(e) => {
              setGameName(e.target.value);
              setErrorMessage("");
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" required />
              )}
            />
          </LocalizationProvider>
          <LoadingButton
            variant="contained"
            fullWidth
            sx={{ height: "50px", width: "100%", fontSize: "20px" }}
            loading={loading}
            onClick={async () => {
              // Basic validation
              if (gameName.length === 0 || !date) {
                setErrorMessage("Please fill out both the title and date.");
                return;
              }

              setLoading(true);

              const res = await addGame(user.id, {
                createdDate: new Date().getTime() / 1000,
                title: gameName,
                holes: [],
                gameDate: date.unix(),
              });

              if (res === "Success!") {
                setGameName("");
                setDate(null);
                setOpen(false);
              } else {
                setErrorMessage(res);
              }

              setLoading(false);
            }}
          >
            CREATE ROUND
          </LoadingButton>
          <Typography color="error">{errorMessage}</Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

export default GameView;
