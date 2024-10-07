import React, { useState, useEffect } from "react";
import { Box, Typography, Grid2, Paper } from "@mui/material";

const OverviewView = ({ currentHoles }) => {
  const [scoringAverages, setScoringAverages] = useState({});
  const [parCounts, setParCounts] = useState({});

  useEffect(() => {
    if (!currentHoles || !currentHoles.length) return;
    const newScoringAverages = {};
    const newParCounts = {};
    [3, 4, 5].forEach((par) => {
      const holes = currentHoles.filter((hole) => hole.par === par);
      const totalScore = holes.reduce((acc, hole) => acc + hole.score, 0);
      const averageScore = totalScore / holes.length;
      newScoringAverages[par] = averageScore;
      newParCounts[par] = holes.length;
    });
    setScoringAverages(newScoringAverages);
    setParCounts(newParCounts);
  }, [currentHoles]);

  return (
    <Box
      sx={{
        p: 3,
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      {currentHoles.length > 0 && (
        <Paper
          sx={{
            width: "500px",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            paddingLeft: 3,
            paddingRight: 3,
          }}
        >
          {[3, 4, 5].map((par) => {
            return (
              <Paper
                key={par}
                sx={{
                  width: "300px",
                  height: "125px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography noWrap fontWeight={"bold"}>
                  {par + " Par Average (" + parCounts[par] + " holes)"}
                </Typography>
                {scoringAverages[par] !== undefined && (
                  <>
                    <Typography noWrap variant="h4">
                      {scoringAverages[par].toFixed(2)}
                    </Typography>
                    <Typography
                      noWrap
                      color={
                        scoringAverages[par] - par < 0
                          ? "green"
                          : scoringAverages[par] - par > 0
                          ? "red"
                          : "black"
                      }
                      fontWeight={"bold"}
                    >
                      {(scoringAverages[par] > par ? "+" : "") +
                        (scoringAverages[par] - par).toFixed(2)}
                    </Typography>
                  </>
                )}
              </Paper>
            );
          })}
        </Paper>
      )}
    </Box>
  );
};

export default OverviewView;
