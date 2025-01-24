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

const GamesListView = ({ userId }) => {
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
      if (!userId) return;
      const newGames = await fetchGames(userId);
      newGames.sort((a, b) => b.gameDate - a.gameDate);
      setGames(newGames);
    };
    fetchData();
  }, [userId]);

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
        <List
          sx={{
            display: "flex",
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
              const res = await addGame(userId, newGame);

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
