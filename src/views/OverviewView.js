import React, { useState, useEffect } from "react";
import { Box, Typography, Grid2, Paper } from "@mui/material";
import { clubs } from "../util/Constants.js";

const OverviewView = ({ currentHoles }) => {
  const [scoringAverages, setScoringAverages] = useState({});
  const [parCounts, setParCounts] = useState({});
  const [clubFirstPuttDistData, setClubFirstPuttDistData] = useState([]);
  const [maxDistance, setMaxDistance] = useState(0);

  useEffect(() => {
    const newScoringAverages = {};
    const newParCounts = {};
    const newClubFirstPuttDistData = [];
    let newMaxDistance = 0;

    // Calculate scoring averages and par counts
    [3, 4, 5].forEach((par) => {
      const holes = currentHoles.filter((hole) => hole.par === par);
      const totalScore = holes.reduce((acc, hole) => acc + hole.score, 0);
      const averageScore = totalScore / holes.length;
      newScoringAverages[par] = averageScore;
      newParCounts[par] = holes.length;
    });

    // Calculate club first putt distances
    clubs.forEach((club) => {
      if (club === "-") return;
      let dist = 0;
      const holes = currentHoles.filter(
        (hole) => hole.approachClub === club && hole.approachShot === "GIR"
      );
      if (holes.length === 0) return;
      holes.forEach((hole) => {
        dist += hole.firstPuttDist;
      });
      newClubFirstPuttDistData.push({
        club: club,
        dist: dist / holes.length,
        count: holes.length,
      });
      newMaxDistance = Math.max(newMaxDistance, dist / holes.length);
    });

    newClubFirstPuttDistData.sort((a, b) => a.dist - b.dist);
    setScoringAverages(newScoringAverages);
    setParCounts(newParCounts);
    setClubFirstPuttDistData(newClubFirstPuttDistData);
    setMaxDistance(newMaxDistance);
  }, [currentHoles]);

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

  const getColorFromDistance = (distanceRatio) => {
    const green = { r: 144, g: 238, b: 144 }; // light green
    const orange = { r: 255, g: 165, b: 0 }; // orange

    // Interpolation
    const r = Math.round(green.r + (orange.r - green.r) * distanceRatio);
    const g = Math.round(green.g + (orange.g - green.g) * distanceRatio);
    const b = Math.round(green.b + (orange.b - green.b) * distanceRatio);

    return `rgb(${r},${g},${b})`;
  };

  return (
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
        })}
      </Paper>
      <Paper
        sx={{
          width: "500px",
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Typography gutterBottom textAlign={"center"} fontWeight={"bold"}>
          Approach Club First Putt Dist
        </Typography>
        <Grid2 sx={{ marginBottom: "10px" }} container>
          <Grid2 size={2}>
            <Typography fontWeight={"bold"} noWrap>
              Club
            </Typography>
          </Grid2>
          <Grid2 size={2}>
            <Typography fontWeight={"bold"} noWrap>
              Distance
            </Typography>
          </Grid2>
          <Grid2 size={2}>
            <Typography fontWeight={"bold"} noWrap>
              Count
            </Typography>
          </Grid2>
          <Grid2 size={6}>
            <Typography fontWeight={"bold"} noWrap>
              Graph
            </Typography>
          </Grid2>
        </Grid2>
        {clubFirstPuttDistData.map((data, index) => {
          const color = getColorFromDistance(data.dist / maxDistance); // Get interpolated color

          return (
            <Grid2 container spacing={1} key={index}>
              <Grid2 size={2}>
                <Typography noWrap>{data.club}</Typography>
              </Grid2>
              <Grid2 size={2}>
                <Typography noWrap>
                  {data.dist.toFixed(2) + " yards"}
                </Typography>
              </Grid2>
              <Grid2 size={2}>
                <Typography noWrap>{data.count + " holes"}</Typography>
              </Grid2>
              <Grid2 size={6}>
                <Box
                  sx={{
                    width: "100%",
                    height: "25px",
                    backgroundColor: "gray",
                    border: "1px solid black",
                    position: "relative",
                  }}
                >
                  <Box
                    key={data.club}
                    sx={{
                      width: `${
                        (data.dist === Infinity ? 0 : data.dist / maxDistance) *
                        100
                      }%`,
                      height: "25px",
                      backgroundColor: color,
                    }}
                  />
                </Box>
              </Grid2>
            </Grid2>
          );
        })}
      </Paper>
    </Box>
  );
};

export default OverviewView;
