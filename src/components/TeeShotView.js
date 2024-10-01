import React, { useState, useEffect } from "react";
import formatDateFromMilliseconds from "../util/DateConverter.js";
import HolesView from "./HolesView.js";
import { Box, Typography, Grid2, Stack } from "@mui/material";
import PieChartView from "./PieChartView.js";
import {
  CustomSelect,
  CustomNumberInput,
  CustomCheckboxDropdown,
} from "./CustomComponents.js";

const clubs = [
  "-",
  "Driver",
  "3-Wood",
  "4-Wood",
  "5-Wood",
  "7-Wood",
  "2-Hybrid",
  "3-Hybrid",
  "4-Hybrid",
  "5-Hybrid",
  "2-Iron",
  "3-Iron",
  "4-Iron",
  "5-Iron",
  "6-Iron",
  "7-Iron",
  "8-Iron",
  "9-Iron",
  "Pitching Wedge",
  "Gap/Approach Wedge",
  "Lob Wedge",
  "Sand Wedge",
];

const teeShots = ["-", "Fairway", "Left", "Right"];
const approachShots = [
  "-",
  "GIR",
  "Short Left",
  "Left",
  "Short Right",
  "Long Left",
  "Right",
  "Long Right",
];
const arr0to9 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const TeeShotView = ({ userData, gameData }) => {
  const [currentHoles, setCurrentHoles] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [parSum, setParSum] = useState(0);
  const [yardAverage, setYardAverage] = useState(0);
  const [totalPutts, setTotalPutts] = useState(0);
  const [firstPuttDistAvg, setFirstPuttDistAvg] = useState(0);
  const [selectedPars, setSelectedPars] = useState([3, 4, 5]);
  const [minYardage, setMinYardage] = useState(0);
  const [maxYardage, setMaxYardage] = useState(1000);
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [selectedTeeClubs, setSelectedTeeClubs] = useState(
    structuredClone(clubs)
  );
  const [selectedTeeShots, setSelectedTeeShots] = useState(
    structuredClone(teeShots)
  );
  useEffect(() => {
    setSelectedGames(gameData);
  }, [gameData]);

  useEffect(() => {
    let pSum = 0;
    let yAvg = 0;
    for (let i = 0; i < currentHoles.length; i++) {
      const hole = currentHoles[i];
      pSum += hole.par;
      yAvg += hole.yardage;
    }

    setParSum(pSum);
    setYardAverage(yAvg / currentHoles.length);
  }, [currentHoles]);

  useEffect(() => {
    const newSelection = [];
    selectedGames.forEach((game) => {
      game.holes.forEach((hole) => {
        if (selectedPars.indexOf(hole.par) === -1) return;
        if (minYardage > hole.yardage) return;
        if (maxYardage < hole.yardage) return;
        if (minScore > hole.score) return;
        if (maxScore < hole.score) return;
        if (selectedTeeClubs.indexOf(hole.teeClub) === -1) return;
        if (selectedTeeShots.indexOf(hole.teeShot) === -1) return;
        newSelection.push(hole);
      });
    });
    setCurrentHoles(newSelection);
  }, [
    selectedGames,
    selectedPars,
    minYardage,
    maxYardage,
    minScore,
    maxScore,
    selectedTeeClubs,
    selectedTeeShots,
  ]);

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
  return (
    <Box sx={{ p: 3 }}>
      <Grid2 container spacing={3}>
        <Box sx={{ width: "100%" }}>
          <Typography
            textAlign="center"
            variant="h6"
            sx={{ width: "100%", fontWeight: "bold" }}
          >
            Pars: {parSum}
          </Typography>

          <Typography
            textAlign="center"
            variant="h6"
            sx={{ width: "100%", fontWeight: "bold" }}
          >
            Number of Holes: {currentHoles.length}
          </Typography>

          <Typography
            textAlign="center"
            variant="h6"
            sx={{ width: "100%", fontWeight: "bold" }}
          >
            Average Yardage: {yardAverage.toFixed(2)}
          </Typography>
        </Box>
      </Grid2>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "500px" }}>
          <CustomCheckboxDropdown
            name="Select Games"
            items={gameData}
            selectedItems={selectedGames}
            setSelectedItems={setSelectedGames}
          />
        </Box>
      </Box>
      <CustomCheckboxDropdown
        name="Select Tee Shot Clubs"
        items={clubs}
        selectedItems={selectedTeeClubs}
        setSelectedItems={setSelectedTeeClubs}
      />
      <CustomCheckboxDropdown
        name="Select Miss Tee"
        items={teeShots}
        selectedItems={selectedTeeShots}
        setSelectedItems={setSelectedTeeShots}
      />
      <Grid2 container spacing={3}>
        <PieChartView
          title="Pars"
          data={[3, 4, 5].map((par) => {
            return {
              id: par,
              label: par.toString(),
              value: getCount(currentHoles, { par: par }),
            };
          })}
        />
        <PieChartView
          title="Scores"
          data={arr0to9.map((score) => {
            return {
              id: score,
              label: score.toString(),
              value: getCount(currentHoles, { score: score }),
            };
          })}
        />

        <PieChartView
          title={`Club Hit from Tee`}
          data={clubs.map((club) => {
            return {
              id: club,
              label: club,
              value: getCount(currentHoles, { teeClub: club }),
            };
          })}
        />
        <PieChartView
          title="Fairway Miss Direction"
          data={teeShots.map((shot) => {
            return {
              id: shot,
              label: shot,
              value: getCount(currentHoles, { teeShot: shot }),
            };
          })}
        />
      </Grid2>
    </Box>
  );
};

export default TeeShotView;
