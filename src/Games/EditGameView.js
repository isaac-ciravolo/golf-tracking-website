import { useState, useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import formatDateFromMilliseconds from "../util/DateConverter";
import { deleteGame, updateGame } from "../firebase/DatabaseFunctions";
import { useNavigate, useParams } from "react-router-dom";
import { fetchGame } from "../firebase/DatabaseFunctions";
import LoadingView from "../views/LoadingView";
const EditGameView = ({ userId }) => {
  const [game, setGame] = useState(null);
  const navigate = useNavigate();
  const { gameId } = useParams();

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      const newGame = await fetchGame(userId, gameId);
      setGame(newGame);
    };
    fetchData();
  }, [userId]);

  const addHole = async () => {
    const newHole = {
      par: "-",
      yardage: 0,
      score: 0,
      teeClub: "-",
      teeShot: "-",
      approachClub: "-",
      approachShot: "-",
      upAndDown: "-",
      totalPutts: 0,
      firstPuttDist: 0,
      penaltyStrokes: 0,
      shotsInside100: 0,
    };
    game.holes.push(newHole);
    const res = await updateGame(userId, gameId, game);
    if (res !== "Success!") {
      alert("Error adding hole: " + res);
    }
    window.location.reload();
  };

  return game ? (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        height: "calc(100vh - 230px)",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        position: "relative",
      }}
    >
      <Typography variant="h2" fontWeight="bold">
        {game.title}
        {" - "}
        {formatDateFromMilliseconds(game.gameDate)}
      </Typography>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: 3,
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={async () => {
            const res = await deleteGame(userId, gameId);
            if (res !== "Success!") {
              alert("Error deleting game");
            } else {
              navigate("/editGames");
            }
          }}
          sx={{ width: "200px", height: "50px" }}
        >
          Delete Game
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/editGames")}
          sx={{ width: "200px", height: "50px" }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={addHole}
          sx={{ width: "200px", height: "50px" }}
        >
          Add Hole
        </Button>
      </Box>

      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          alignItems: "center",
          overflowY: "scroll",
        }}
      >
        {game.holes.map((hole, index) => (
          <ListItem key={index}>
            <ListItemButton
              sx={{ width: "100%", height: "50px" }}
              onClick={() => navigate("/editGames/" + gameId + "/" + index)}
            >
              Hole {index + 1}: Par {hole.par}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  ) : (
    <LoadingView />
  );
};

export default EditGameView;
