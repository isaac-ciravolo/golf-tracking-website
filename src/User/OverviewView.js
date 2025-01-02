import React, { useState, useEffect } from "react";
import { Box, Typography, Grid2, Paper } from "@mui/material";
import { colors } from "../util/Constants.js";

const OverviewView = ({ currentHoles, numGames }) => {
  const [scoringAverages, setScoringAverages] = useState({});
  const [fairwayPercentage, setFairwayPercentage] = useState(0);
  const [girPercentage, setGirPercentage] = useState(0);
  const [totalPutts, setTotalPutts] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [totalPars, setTotalPars] = useState(0);

  const ParPaper = ({ par }) => {
    return (
      <Paper
        key={par}
        sx={{
          width: "200px",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography noWrap fontWeight={"bold"}>
          {par + " Par"}
        </Typography>
        {scoringAverages[par] !== undefined && (
          <>
            <Typography noWrap variant="h4">
              {scoringAverages[par].toFixed(2)}
            </Typography>
            <Typography
              noWrap
              color={getColorFromScore(scoringAverages[par], par)} // Smooth color transition
              fontWeight={"bold"}
            >
              {(scoringAverages[par] > par ? "+" : "") +
                (scoringAverages[par] - par).toFixed(2)}
            </Typography>
          </>
        )}
      </Paper>
    );
  };

  useEffect(() => {
    // Calculate scoring averages and par counts
    const newScoringAverages = {};
    [3, 4, 5].forEach((par) => {
      const holes = currentHoles.filter((hole) => hole.par === par);
      const totalScore = holes.reduce((acc, hole) => acc + hole.score, 0);
      const averageScore = totalScore / holes.length;
      newScoringAverages[par] = averageScore;
    });
    setScoringAverages(newScoringAverages);

    // Calculate fairway percentage
    setFairwayPercentage(
      ((getCount(currentHoles, { teeShot: "Fairway", par: 4 }) +
        getCount(currentHoles, { teeShot: "Fairway", par: 5 })) /
        (getCount(currentHoles, { par: 4 }) +
          getCount(currentHoles, { par: 5 }))) *
        100
    );
    setGirPercentage(
      (getCount(currentHoles, { approachShot: "GIR" }) / currentHoles.length) *
        100
    );

    let newTotalPutts = 0;
    let newTotalScore = 0;
    let newTotalPars = 0;
    currentHoles.forEach((hole) => {
      newTotalPutts += hole.totalPutts;
      newTotalScore += hole.score;
      newTotalPars += hole.par;
    });
    setTotalPutts(newTotalPutts);
    setTotalScore(newTotalScore);
    setTotalPars(newTotalPars);
  }, [currentHoles]);

  const getCount = (currHoles, conditions) => {
    let count = 0;
    currHoles.forEach((hole) => {
      let add = 1;
      Object.keys(hole).forEach((key) => {
        if (conditions[key] !== undefined && conditions[key] !== hole[key])
          add = 0;
      });
      count += add;
    });
    return count;
  };

  const getColorFromScore = (score, par) => {
    const green = { r: 144, g: 238, b: 144 }; // Light green
    const black = { r: 150, g: 150, b: 150 }; // Black
    const red = { r: 255, g: 0, b: 0 }; // Red

    // Calculate the difference from par
    const diff = score - par;
    const range = 3; // Define a range for scoring differences (e.g., -3 to +3)

    if (diff < -range) return `rgb(${green.r},${green.g},${green.b})`; // Very good
    if (diff > range) return `rgb(${red.r},${red.g},${red.b})`; // Very bad

    // Calculate color interpolation
    let ratio;
    if (diff < 0) {
      // From green to black
      ratio = Math.abs(diff) / range;
      const r = Math.round(green.r + (black.r - green.r) * ratio);
      const g = Math.round(green.g + (black.g - green.g) * ratio);
      const b = Math.round(green.b + (black.b - green.b) * ratio);
      return `rgb(${r},${g},${b})`;
    } else {
      // From black to red
      ratio = diff / range;
      const r = Math.round(black.r + (red.r - black.r) * ratio);
      const g = Math.round(black.g + (red.g - black.g) * ratio);
      const b = Math.round(black.b + (red.b - black.b) * ratio);
      return `rgb(${r},${g},${b})`;
    }
  };

  const hexToRgb = (hex) => {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, "");

    // Parse the r, g, b values
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return { r, g, b };
  };

  const getColorFromPercentage = (percentage) => {
    const green = hexToRgb(colors.Yes); // Green
    const red = hexToRgb(colors.No); // Red

    // Calculate color interpolation
    const ratio = 1 - percentage / 100;
    const r = Math.round(green.r + (red.r - green.r) * ratio);
    const g = Math.round(green.g + (red.g - green.g) * ratio);
    const b = Math.round(green.b + (red.b - green.b) * ratio);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <>
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
      }}
    >
      <Paper
        sx={{
          width: "500px",
          height: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          padding: 3,
        }}
      >
        <Typography fontWeight="bold" variant="h6">
          Scoring Averages
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          <ParPaper par={3} />
          <ParPaper par={4} />
        </Box>
        <Box sx={{ display: "flex", gap: 3 }}>
          <ParPaper par={5} />
          <Paper
            sx={{
              width: "200px",
              height: "200px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography noWrap fontWeight={"bold"}>
              Average Score
            </Typography>
            <Typography noWrap variant="h4">
              {(totalScore / numGames).toFixed(2)}
            </Typography>
          </Paper>
        </Box>
      </Paper>
      
      <Paper
        sx={{
          width: "500px",
          height: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          padding: 3,
        }}
      >
        <Typography fontWeight="bold" variant="h6">
          Statistics
        </Typography>
        <Paper
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
            Fairway %
          </Typography>
          <Typography
            noWrap
            variant="h4"
            color={getColorFromPercentage(fairwayPercentage)}
          >
            {fairwayPercentage.toFixed(2) + "%"}
          </Typography>
        </Paper>
        <Paper
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
            Green in Regulation %
          </Typography>
          <Typography
            noWrap
            variant="h4"
            color={getColorFromPercentage(girPercentage)}
          >
            {girPercentage.toFixed(2) + "%"}
          </Typography>
        </Paper>
        <Paper
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
            Putts Per Round
          </Typography>
          <Typography noWrap variant="h4">
            {(totalPutts / numGames).toFixed(2)}
          </Typography>
        </Paper>
      </Paper>
    </Box>
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        padding: 3,
      }}
    >
    <Paper
        sx={{
          width: "500px",
          height: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          padding: 3,
        }}
      >
        <Typography fontWeight="bold" variant="h6">
          Scoring Averages
        </Typography>
      <Paper
        sx={{
          width: "200px",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        
        <Typography noWrap fontWeight={"bold"}>
          Greens Per Round
        </Typography>
        <Typography noWrap variant="h4">
          {(totalPars / numGames).toFixed(2)}
        </Typography>
      </Paper>
      <Paper
        sx={{
          width: "200px",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography noWrap fontWeight={"bold"}>
          Up and Down Per Round
        </Typography>
        <Typography noWrap variant="h4">
          {(totalScore / numGames).toFixed(2)}
        </Typography>
      </Paper>
      </Paper>
      </Box>
    </>
  );
};

export default OverviewView;
