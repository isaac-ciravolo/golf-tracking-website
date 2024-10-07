import React, { useState, useEffect } from "react";
import { Box, Typography, Grid2, Paper } from "@mui/material";
import { clubs } from "../util/Constants.js";

const OverviewView = ({ currentHoles }) => {
  const [scoringAverages, setScoringAverages] = useState({});
  const [parCounts, setParCounts] = useState({});
  const [clubFirstPuttDistData, setClubFirstPuttDistData] = useState([]);
  const [maxDistance, setMaxDistance] = useState(0);

  useEffect(() => {
    if (!currentHoles || !currentHoles.length) return;
    const newScoringAverages = {};
    const newParCounts = {};
    const newClubFirstPuttDistData = [];
    let newMaxDistance = 0;
    [3, 4, 5].forEach((par) => {
      const holes = currentHoles.filter((hole) => hole.par === par);
      const totalScore = holes.reduce((acc, hole) => acc + hole.score, 0);
      const averageScore = totalScore / holes.length;
      newScoringAverages[par] = averageScore;
      newParCounts[par] = holes.length;
    });
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
      }}
    >
      {currentHoles.length > 0 && (
        <>
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
          <Paper
            sx={{
              width: "1000px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: 3,
            }}
          >
            <Typography
              gutterBottom
              fullWidth
              textAlign={"center"}
              fontWeight={"bold"}
            >
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
                            (data.dist === Infinity
                              ? 0
                              : data.dist / maxDistance) * 100
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
        </>
      )}
    </Box>
  );
};

export default OverviewView;
