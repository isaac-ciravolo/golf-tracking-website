import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import formatDateFromMilliseconds from "../util/DateConverter";
import { deleteGame, updateGame } from "../DatabaseFunctions";
import EditHoleView from "./EditHoleView";
const EditGameView = ({ game, userId, back }) => {
  const [selectedHoleIndex, setSelectedHoleIndex] = useState(-1);
  useEffect(() => {
    console.log(selectedHoleIndex);
  }, [selectedHoleIndex]);
  return selectedHoleIndex !== -1 ? (
    <EditHoleView
      game={game}
      index={selectedHoleIndex}
      goBack={() => setSelectedHoleIndex(-1)}
    />
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 3,
        gap: 3,
        position: "relative",
        overflow: "scroll",
      }}
    >
      <Typography variant="h2" fontWeight="bold">
        {game.title}
        {" - "}
        {formatDateFromMilliseconds(game.gameDate)}
      </Typography>

      {game.holes.map((hole, index) => (
        <Box key={index} sx={{ display: "flex", flexDirection: "row" }}>
          <Button
            variant="contained"
            onClick={() => setSelectedHoleIndex(index)}
          >
            Hole {index + 1}: Par {hole.par}
          </Button>
        </Box>
      ))}

      <Button
        variant="contained"
        sx={{ position: "absolute", right: "20px", top: "20px" }}
        onClick={async () => {
          const res = await deleteGame(userId, game.id);
          if (res !== "Success!") {
            alert("Error deleting game");
          }
        }}
      >
        Delete Game
      </Button>
      <Button
        variant="contained"
        sx={{ position: "absolute", left: "20px", top: "20px" }}
        onClick={back}
      >
        Back
      </Button>
    </Box>
  );
};

export default EditGameView;
