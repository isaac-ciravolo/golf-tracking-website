import { useState, useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Icon,
} from "@mui/material";
import formatDateFromMilliseconds from "../util/DateConverter";
import { useNavigate, useParams } from "react-router-dom";
import LoadingView from "../views/LoadingView";
import { useAuth } from "../firebase/AuthContext";
import { validHole } from "../util/ValidChecker";
import WarningIcon from "@mui/icons-material/Warning";
import { auth } from "../firebase/firebase.js";
import { deleteGame, updateGame, fetchGame } from "../database/GameFunctions";

const EditGameView = () => {
  const [game, setGame] = useState(null);
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { userData: user } = useAuth();
  const [validGame, setValidGame] = useState(false);
  const [validNumHoles, setValidNumHoles] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const token = await auth.currentUser.getIdToken();
      const res = await fetchGame(token, gameId);

      if (res.status !== 200) {
        alert("Error fetching game: " + res.error);
        return;
      }

      const newGame = res.data;
      setGame(newGame);

      for (let i = 0; i < newGame.holes.length; i++) {
        if (!validHole(newGame.holes[i])) {
          setValidGame(false);
          return;
        }
      }
      setValidGame(true);
      if (newGame.holes.length === 9 || newGame.holes.length === 18) {
        setValidNumHoles(true);
      } else {
        setValidNumHoles(false);
      }
    };
    fetchData();
  }, [user, gameId]);

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

    const token = await auth.currentUser.getIdToken();
    const res = await updateGame(token, gameId, game);

    if (res.status !== 200) alert("Error adding hole: " + res.error);
    else window.location.reload();
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
      {!validGame ? (
        <Typography color="error">
          Please Fill Out All The Holes to be Considered For Analysis
        </Typography>
      ) : !validNumHoles ? (
        <Typography color="error">
          Please Make Sure There Are Either 9 or 18 Holes
        </Typography>
      ) : (
        <Typography color="success">
          This Game is Valid and Will Be Considered For Analysis
        </Typography>
      )}

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
            const token = await auth.currentUser.getIdToken();
            const res = await deleteGame(token, gameId);
            if (res.status !== 200) {
              alert(res.error);
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
              Hole {index + 1}
            </ListItemButton>
            {validHole(hole) ? (
              ""
            ) : (
              <Icon color="primary">
                <WarningIcon />
              </Icon>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  ) : (
    <LoadingView />
  );
};

export default EditGameView;
