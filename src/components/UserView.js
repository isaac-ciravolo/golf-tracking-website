import React, { useState, useEffect } from "react";
import formatDateFromMilliseconds from "../util/DateConverter.js";
import GameView from "./GameView.js";
import { Box, Typography, Grid2 } from "@mui/material";
import PieChartView from "./PieChartView.js";
import { CustomSelect } from "./CustomComponents.js";

const UserView = ({ userData, gameData }) => {
  const [GIRtrue, setGIRtrue] = useState(0);
  const [GIRfalse, setGIRfalse] = useState(0);
  const [UDtrue, setUDtrue] = useState(0);
  const [UDfalse, setUDfalse] = useState(0);
  const [showHoles, setShowHoles] = useState(false); // State to track visibility of holes
  const [currentSelection, setCurrentSelection] = useState([]);

  useEffect(() => {
    setCurrentSelection(gameData);
  }, []);

  useEffect(() => {
    let girTrueCount = 0;
    let girFalseCount = 0;
    let udTrueCount = 0;
    let udFalseCount = 0;
    for (let i = 0; i < currentSelection.length; i++) {
      for (let j = 0; j < currentSelection[i].holes.length; j++) {
        const hole = currentSelection[i].holes[j];
        if (hole.gir) {
          girTrueCount++;
        } else {
          girFalseCount++;
        }
        if (hole.upAndDown) {
          udTrueCount++;
        } else {
          udFalseCount++;
        }
      }
    }
    setGIRtrue(girTrueCount);
    setGIRfalse(girFalseCount);
    setUDtrue(udTrueCount);
    setUDfalse(udFalseCount);
  }, [currentSelection]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography textAlign="center" variant="h2" sx={{ fontWeight: "bold" }}>
        {userData.name}
      </Typography>
      {gameData.map((game) => {
        if (game && game.holes) return <GameView key={game.id} game={game} />;
        else return null;
      })}

      <Box sx={{ p: 3 }}>
        <Grid2 container spacing={3}>
          <PieChartView
            title="GIR"
            data={[
              { id: 0, label: "Yes", value: GIRtrue, color: "#468f15" },
              { id: 1, label: "No", value: GIRfalse, color: "#94042b" },
            ]}
          />
          <PieChartView
            title="Up and Down"
            data={[
              {
                id: 0,
                label: "Yes",
                value: UDtrue,
                color: "#468f15",
              },
              {
                id: 1,
                label: "No",
                value: UDfalse,
                color: "#94042b",
              },
            ]}
          />
        </Grid2>
      </Box>
    </Box>
  );
};

export default UserView;
