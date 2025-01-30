import React, { useState, useEffect } from "react";
import { Box, Typography, Grid2, Paper } from "@mui/material";
import { approachShots, colors } from "../util/Constants.js";
import { getCountAnd } from "../util/GetCount.js";
const OverviewView = ({
  currentHoles,
  numGames,
  currentNineHoles,
  numNineHolesGames,
  currentEighteenHoles,
  numEighteenHolesGames,
}) => {
  const [scoringAverages, setScoringAverages] = useState({});
  const [fairwayPercentage, setFairwayPercentage] = useState(0);
  const [girPercentage, setGirPercentage] = useState(0);
  const [totalPutts, setTotalPutts] = useState(0);
  const [totalNineHolePutts, setTotalNineHolePutts] = useState(0);
  const [totalEighteenHolePutts, setTotalEighteenHolePutts] = useState(0);
  const [totalNineHoleScore, setTotalNineHoleScore] = useState(0);
  const [totalEighteenHoleScore, setTotalEighteenHoleScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [totalPars, setTotalPars] = useState(0);
  const [totalGIR, setTotalGIR] = useState(0);

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
      ((getCountAnd(currentHoles, { teeShot: "Fairway", par: 4 }) +
        getCountAnd(currentHoles, { teeShot: "Fairway", par: 5 })) /
        (getCountAnd(currentHoles, { par: 4 }) +
          getCountAnd(currentHoles, { par: 5 }))) *
        100
    );
    setGirPercentage(
      (getCountAnd(currentHoles, { approachShot: "GIR" }) /
        currentHoles.length) *
        100
    );

    let newNineTotalScore = 0;
    let newNineTotalPutts = 0;
    currentNineHoles.forEach((hole) => {
      newNineTotalPutts += hole.totalPutts;
      newNineTotalScore += hole.score;
    });
    setTotalNineHolePutts(newNineTotalPutts);
    setTotalNineHoleScore(newNineTotalScore);

    let newEighteenTotalScore = 0;
    let newEighteenTotalPutts = 0;
    currentEighteenHoles.forEach((hole) => {
      newEighteenTotalPutts += hole.totalPutts;
      newEighteenTotalScore += hole.score;
    });
    setTotalEighteenHolePutts(newEighteenTotalPutts);
    setTotalEighteenHoleScore(newEighteenTotalScore);

    let newTotalPars = 0;
    currentHoles.forEach((hole) => {
      newTotalPars += hole.par;
    });

    setTotalPars(newTotalPars);
  }, [currentHoles, currentNineHoles, currentEighteenHoles]);

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

  const getColorForFairway = (percentage) => {
    if (percentage > 70) return colors.Yes;
    else if (percentage > 60) return "rgb(255,165,0)";
    else return colors.No;
  };

  const getColorForGir = (percentage) => {
    if (percentage > 66.666) return colors.Yes;
    else if (percentage > 33.333) return "rgb(255,165,0)";
    else return "rgb(255, 0, 0)";
  };

  const getColorForPuttsPerRound = (putts) => {
    if (putts < 30) return colors.Yes;
    else return "rgb(255, 0, 0)";
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
                Average 18 Hole Score
              </Typography>
              <Typography noWrap sx={{ marginBottom: "10px" }} variant="h4">
                {(totalEighteenHoleScore / numEighteenHolesGames).toFixed(2)}
              </Typography>
              <Typography noWrap fontWeight={"bold"}>
                Average 9 Hole Score
              </Typography>
              <Typography noWrap variant="h4">
                {(totalNineHoleScore / numNineHolesGames).toFixed(2)}
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
            Key Statistics
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
              color={getColorForFairway(fairwayPercentage)}
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
              color={getColorForGir(girPercentage)}
            >
              {girPercentage.toFixed(2) + "%"}
            </Typography>
          </Paper>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Paper
              sx={{
                width: "250px",
                height: "125px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography noWrap fontWeight={"bold"}>
                Putts Per 18 Holes
              </Typography>
              <Typography
                noWrap
                variant="h4"
                color={getColorForPuttsPerRound(
                  totalEighteenHolePutts / numEighteenHolesGames
                )}
              >
                {(totalEighteenHolePutts / numEighteenHolesGames).toFixed(2)}
              </Typography>
            </Paper>
            <Paper
              sx={{
                width: "250px",
                height: "125px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography noWrap fontWeight={"bold"}>
                Putts Per 9 Holes
              </Typography>
              <Typography
                noWrap
                variant="h4"
                color={getColorForPuttsPerRound(
                  totalNineHolePutts / numNineHolesGames
                )}
              >
                {(totalNineHolePutts / numNineHolesGames).toFixed(2)}
              </Typography>
            </Paper>
          </Box>
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
            Scoring
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
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
                Greens Per 18 holes
              </Typography>
              <Typography noWrap variant="h4">
                {(
                  getCountAnd(currentEighteenHoles, { approachShot: "GIR" }) /
                  numEighteenHolesGames
                ).toFixed(2)}
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
                Greens Per 9 holes
              </Typography>
              <Typography noWrap variant="h4">
                {(
                  getCountAnd(currentNineHoles, { approachShot: "GIR" }) /
                  numNineHolesGames
                ).toFixed(2)}
              </Typography>
            </Paper>
          </Box>
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
              Up and Down %
            </Typography>
            <Typography noWrap variant="h4">
              {(
                (getCountAnd(currentHoles, { upAndDown: "Yes" }) /
                  (getCountAnd(currentHoles, { upAndDown: "Yes" }) +
                    getCountAnd(currentHoles, { upAndDown: "No" }))) *
                100
              ).toFixed(2)}
              %
            </Typography>
          </Paper>
        </Paper>
      </Box>
    </>
  );
};

export default OverviewView;
