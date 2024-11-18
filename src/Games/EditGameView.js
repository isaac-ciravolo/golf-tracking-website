import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import formatDateFromMilliseconds from "../util/DateConverter";
import { addGame } from "../DatabaseFunctions";

const EditGameView = ({ game, userId }) => {
  const [selectedHole, setSelectedHole] = useState(null);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 3,
        gap: 3,
      }}
    >
      <Typography variant="h2" fontWeight="bold">
        {game.title}
        {" - "}
        {formatDateFromMilliseconds(game.gameDate)}
      </Typography>

      {game.holes.map((hole, index) => (
        <Box key={index} sx={{ display: "flex", flexDirection: "row" }}>
          <Button variant="contained">
            Hole {index + 1}: Par {hole.par}
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default EditGameView;
