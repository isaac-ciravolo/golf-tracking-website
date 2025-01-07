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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { addGame, fetchGames } from "../DatabaseFunctions";
import formatDateFromMilliseconds from "../util/DateConverter";

const GamesListView = ({ userId }) => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [gameName, setGameName] = useState("");
  const [date, setDate] = useState(null);

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

              setLoading(true);

              const newGame = {
                createdDate: new Date().getTime() / 1000,
                title: gameName,
                holes: [],
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
