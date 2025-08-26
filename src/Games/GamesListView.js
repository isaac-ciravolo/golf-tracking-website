import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ButtonGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { addGame, fetchGames } from "../firebase/DatabaseFunctions";
import formatDateFromMilliseconds from "../util/DateConverter";
import { clubs, teeShots, approachShots } from "../util/Constants";
import { useAuth } from "../firebase/AuthContext";

const GamesListView = () => {
  const { userData: user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [gameName, setGameName] = useState("");
  const [date, setDate] = useState(null);
  const [gameType, setGameType] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const newGames = await fetchGames(user.id);
      newGames.sort((a, b) => b.gameDate - a.gameDate);
      setGames(newGames);
    };
    fetchData();
  }, [user]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 230px)",
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
            Add Round
          </Typography>
        </Button>

        {process.env.NODE_ENV === "development" && (
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "90%",
            }}
            onClick={async () => {
              const newHoles = [];
              for (let i = 0; i < 9; i++) {
                const newHole = {};
                newHole.par = [3, 4, 5][Math.floor(Math.random() * 3)];
                if (newHole.par === 3)
                  newHole.yardage =
                    Math.floor(Math.random() * (200 - 140 + 1)) + 140;
                if (newHole.par === 4)
                  newHole.yardage =
                    Math.floor(Math.random() * (450 - 300 + 1)) + 300;
                if (newHole.par === 5)
                  newHole.yardage =
                    Math.floor(Math.random() * (700 - 500 + 1)) + 500;
                newHole.score = newHole.par + Math.floor(Math.random() * 3); // 0-2 over/under par
                if (newHole.par > 3) {
                  newHole.teeClub =
                    clubs[Math.floor(Math.random() * (clubs.length - 1)) + 1];
                  newHole.teeShot =
                    teeShots[
                      Math.floor(Math.random() * (teeShots.length - 1)) + 1
                    ];
                } else {
                  newHole.teeClub = clubs[0];
                  newHole.teeShot = teeShots[0];
                }
                newHole.approachClub =
                  clubs[Math.floor(Math.random() * (clubs.length - 1)) + 1];
                newHole.approachShot =
                  approachShots[
                    Math.floor(Math.random() * (approachShots.length - 1)) + 1
                  ];

                if (newHole.approachShot !== "GIR") {
                  newHole.upAndDown = ["Yes", "No"][
                    Math.floor(Math.random() * 2)
                  ];
                  newHole.upAndDownClub =
                    clubs[Math.floor(Math.random() * (clubs.length - 1)) + 1];
                } else {
                  newHole.upAndDown = "-";
                  newHole.upAndDownClub = "-";
                }
                newHole.totalPutts = Math.floor(Math.random() * 3) + 1; // 1-3 putts
                newHole.firstPuttDist = Math.floor(Math.random() * 30); // 0-30 feet
                newHole.penaltyStrokes = Math.floor(Math.random() * 2); // 0-1 penalty strokes
                newHole.shotsInside100 = Math.floor(Math.random() * 3); // 0-2 shots inside 100 yards
                newHoles.push(newHole);
              }
              const newGame = {
                createdDate: new Date().getTime() / 1000,
                title: "Random Round",
                holes: newHoles,
                gameDate: new Date().getTime() / 1000,
              };

              console.log(user.id, newGame);

              const res = await addGame(user.id, newGame);

              if (res === "Success!") window.location.reload();
              else alert("Error adding game: " + res);
            }}
          >
            <Typography fontSize="40px" fontWeight={"bold"}>
              Add Random 9 Hole Game
            </Typography>
          </Button>
        )}

        {process.env.NODE_ENV === "development" && (
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "90%",
            }}
            onClick={async () => {
              const newHoles = [];
              for (let i = 0; i < 18; i++) {
                const newHole = {};
                newHole.par = [3, 4, 5][Math.floor(Math.random() * 3)];
                if (newHole.par === 3)
                  newHole.yardage =
                    Math.floor(Math.random() * (200 - 140 + 1)) + 140;
                if (newHole.par === 4)
                  newHole.yardage =
                    Math.floor(Math.random() * (450 - 300 + 1)) + 300;
                if (newHole.par === 5)
                  newHole.yardage =
                    Math.floor(Math.random() * (700 - 500 + 1)) + 500;
                newHole.score = newHole.par + Math.floor(Math.random() * 3); // 0-2 over/under par
                if (newHole.par > 3) {
                  newHole.teeClub =
                    clubs[Math.floor(Math.random() * (clubs.length - 1)) + 1];
                  newHole.teeShot =
                    teeShots[
                      Math.floor(Math.random() * (teeShots.length - 1)) + 1
                    ];
                } else {
                  newHole.teeClub = clubs[0];
                  newHole.teeShot = teeShots[0];
                }
                newHole.approachClub =
                  clubs[Math.floor(Math.random() * (clubs.length - 1)) + 1];
                newHole.approachShot =
                  approachShots[
                    Math.floor(Math.random() * (approachShots.length - 1)) + 1
                  ];

                if (newHole.approachShot !== "GIR") {
                  newHole.upAndDown = ["Yes", "No"][
                    Math.floor(Math.random() * 2)
                  ];
                  newHole.upAndDownClub =
                    clubs[Math.floor(Math.random() * (clubs.length - 1)) + 1];
                } else {
                  newHole.upAndDown = "-";
                  newHole.upAndDownClub = "-";
                }
                newHole.totalPutts = Math.floor(Math.random() * 3) + 1; // 1-3 putts
                newHole.firstPuttDist = Math.floor(Math.random() * 30); // 0-30 feet
                newHole.penaltyStrokes = Math.floor(Math.random() * 2); // 0-1 penalty strokes
                newHole.shotsInside100 = Math.floor(Math.random() * 3); // 0-2 shots inside 100 yards
                newHoles.push(newHole);
              }
              const newGame = {
                createdDate: new Date().getTime() / 1000,
                title: "Random Round",
                holes: newHoles,
                gameDate: new Date().getTime() / 1000,
              };

              console.log(user.id, newGame);

              const res = await addGame(user.id, newGame);

              if (res === "Success!") window.location.reload();
              else alert("Error adding game: " + res);
            }}
          >
            <Typography fontSize="40px" fontWeight={"bold"}>
              Add Random 18 Hole Game
            </Typography>
          </Button>
        )}

        <List
          sx={{
            dizay: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            alignItems: "center",
            overflow: "scroll",
          }}
        >
          {games.map((game, index) => (
            <ListItem key={index}>
              <ListItemButton
                onClick={() => {
                  navigate("/editGames/" + game.id);
                }}
                sx={{ width: "100%", height: "50px" }}
              >
                {game.title} - {formatDateFromMilliseconds(game.gameDate)}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
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

          <ButtonGroup variant="outlined" fullWidth>
            <Button
              variant={gameType === "9-Hole" ? "contained" : "outlined"}
              onClick={() => {
                if (gameType === "9-Hole") setGameType(null);
                else setGameType("9-Hole");
              }}
            >
              9-Hole
            </Button>
            <Button
              variant={gameType === "18-Hole" ? "contained" : "outlined"}
              onClick={() => {
                if (gameType === "18-Hole") setGameType(null);
                else setGameType("18-Hole");
              }}
            >
              18-Hole
            </Button>
          </ButtonGroup>

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
              if (gameName.length === 0 || !date) {
                setErrorMessage("Please fill out both the title and date.");
                return;
              }

              if (gameType === null) {
                setErrorMessage("Please select a game type.");
                return;
              }

              setLoading(true);

              const newHoles = [];

              const newHole = {
                par: "-",
                yardage: 0,
                score: 0,
                teeClub: "-",
                teeShot: "-",
                approachClub: "-",
                approachShot: "-",
                upAndDown: "-",
                upAndDownClub: "-",
                totalPutts: 0,
                firstPuttDist: 0,
                penaltyStrokes: 0,
                shotsInside100: 0,
              };

              if (gameType === "9-Hole") {
                for (let i = 0; i < 9; i++) {
                  newHoles.push({ ...newHole });
                }
              }
              if (gameType === "18-Hole") {
                for (let i = 0; i < 18; i++) {
                  newHoles.push({ ...newHole });
                }
              }

              const newGame = {
                createdDate: new Date().getTime() / 1000,
                title: gameName,
                holes: newHoles,
                gameDate: date.unix(),
              };
              const res = await addGame(user.id, newGame);

              if (res === "Success!") {
                window.location.reload();
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
    </>
  );
};

export default GamesListView;
