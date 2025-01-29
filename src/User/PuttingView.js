import React, { useState, useEffect } from "react";
import { Box, Grid2, Paper, Typography } from "@mui/material";
import { CustomSelect } from "../components/CustomComponents.js";
import PercentBox from "../components/PercentBox.js";
import HalfPizzaGraph from "../components/HalfPizzaGraph.js";

import { clubs, yesAndNo, colors } from "../util/Constants.js";
import { getCountAnd } from "../util/GetCount.js";

const PuttingView = ({
  currentHoles,
  numGames,
  currentNineHoles,
  numNineHolesGames,
  currentEighteenHoles,
  numEighteenHolesGames,
}) => {
  const [selectedClub, setSelectedClub] = useState("-");
  const [selectedData, setSelectedData] = useState([]);
  const [selectedTotal, setSelectedTotal] = useState(0);
  const [allData, setAllData] = useState([]);
  const [allTotal, setAllTotal] = useState(0);
  const [totalPutts, setTotalPutts] = useState(0);
  const [totalNineHolePutts, setTotalNineHolePutts] = useState(0);
  const [totalEighteenHolePutts, setTotalEighteenHolePutts] = useState(0);
  const [parCounts, setParCounts] = useState({});
  const [clubFirstPuttDistData, setClubFirstPuttDistData] = useState([]);
  const [maxDistance, setMaxDistance] = useState(0);

  useEffect(() => {
    console.log(numEighteenHolesGames);
    const newSelectedData = [];
    let newSelectedTotal = 0;
    yesAndNo.slice(1, yesAndNo.length).forEach((shot) => {
      const newValue = getCountAnd(currentHoles, {
        yesAndNoClub: selectedClub,
        yesAndNo: shot,
      });
      newSelectedData.push({
        value: newValue,
        label: shot,
        color: colors[shot],
      });
      newSelectedTotal += newValue;
    });
    setSelectedData(newSelectedData);
    setSelectedTotal(newSelectedTotal);
    const newAllData = [];
    let newAllTotal = 0;
    yesAndNo.slice(1, yesAndNo.length).forEach((shot) => {
      const newValue = getCountAnd(currentHoles, { yesAndNo: shot });
      newAllData.push({
        value: newValue,
        label: shot,
        color: colors[shot],
      });
      newAllTotal += newValue;
    });
    setAllData(newAllData);
    setAllTotal(newAllTotal);

    let newNineTotalPutts = 0;
    currentNineHoles.forEach((hole) => {
      newNineTotalPutts += hole.totalPutts;
    });
    setTotalNineHolePutts(newNineTotalPutts);

    let newEighteenTotalPutts = 0;
    currentEighteenHoles.forEach((hole) => {
      newEighteenTotalPutts += hole.totalPutts;
    });
    setTotalEighteenHolePutts(newEighteenTotalPutts);

    let newTotalPutts = 0;
    currentHoles.forEach((hole) => {
      newTotalPutts += hole.totalPutts;
    });
    setTotalPutts(newTotalPutts);

    const newParCounts = {};
    const newClubFirstPuttDistData = [];
    let newMaxDistance = 0;

    // Calculate scoring averages and par counts
    [3, 4, 5].forEach((par) => {
      const holes = currentHoles.filter((hole) => hole.par === par);
      const totalScore = holes.reduce((acc, hole) => acc + hole.score, 0);
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
    setParCounts(newParCounts);
    setClubFirstPuttDistData(newClubFirstPuttDistData);
    setMaxDistance(newMaxDistance);
  }, [currentHoles, selectedClub]);

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
        gap: 3,
      }}
    >
      <Box sx={{ display: "flex", gap: 3 }}>
        <Paper
          sx={{
            width: "1075px",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            p: 3,
          }}
        >
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
              {"Total Putts"}
            </Typography>
            <Typography noWrap variant="h4">
              {totalPutts}
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
              {"Putts per Hole"}
            </Typography>
            <Typography noWrap variant="h4">
              {(totalPutts / currentHoles.length).toFixed(2)}
            </Typography>
          </Paper>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
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
                {"Putts per 9 Holes"}
              </Typography>
              <Typography noWrap variant="h4">
                {(totalNineHolePutts / numNineHolesGames).toFixed(2)}
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
                {"Putts per 18 Holes"}
              </Typography>
              <Typography noWrap variant="h4">
                {(totalEighteenHolePutts / numEighteenHolesGames).toFixed(2)}
              </Typography>
            </Paper>
          </Box>
        </Paper>
      </Box>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Paper
          sx={{
            width: "500px",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            p: 3,
          }}
        >
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
              {"Putts per GIR"}
            </Typography>
            <Typography noWrap variant="h4">
              {(
                currentHoles
                  .filter((hole) => hole.approachShot === "GIR")
                  .reduce((acc, hole) => acc + hole.totalPutts, 0) /
                currentHoles.filter((hole) => hole.approachShot === "GIR")
                  .length
              ).toFixed(2)}
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
              {"Putts per Missed GIR"}
            </Typography>
            <Typography noWrap variant="h4">
              {(
                currentHoles
                  .filter((hole) => hole.approachShot !== "GIR")
                  .reduce((acc, hole) => acc + hole.totalPutts, 0) /
                currentHoles.filter((hole) => hole.approachShot !== "GIR")
                  .length
              ).toFixed(2)}
            </Typography>
          </Paper>
        </Paper>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Paper
            sx={{
              width: "500px",
              height: "500px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
              p: 3,
            }}
          >
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
                {"1 Putt Percentage"}
              </Typography>
              <Typography noWrap variant="h4">
                {(
                  (currentHoles.filter((hole) => hole.totalPutts === 1).length /
                    currentHoles.length) *
                  100
                ).toFixed(2) + "%"}
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
                {"3 Putt Percentage"}
              </Typography>
              <Typography noWrap variant="h4">
                {(
                  (currentHoles.filter((hole) => hole.totalPutts >= 3).length /
                    currentHoles.length) *
                  100
                ).toFixed(2) + "%"}
              </Typography>
            </Paper>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default PuttingView;
