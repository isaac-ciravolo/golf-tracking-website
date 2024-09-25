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

const missTees = ["-", "Left", "Right"];
const missApproaches = [
  "-",
  "Short Left",
  "Left",
  "Short Right",
  "Long Left",
  "Right",
  "Long Right",
];
const arr0to9 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const UserView = ({ userData, gameData }) => {
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
  const [selectedTeeShotClubs, setSelectedTeeShotClubs] = useState(
    structuredClone(clubs)
  );
  const [fairwaySelection, setFairwaySelection] = useState("Both");
  const [selectedMissTee, setSelectedMissTee] = useState(
    structuredClone(missTees)
  );
  const [selectedApproachClubs, setSelectedApproachClubs] = useState(
    structuredClone(clubs)
  );
  const [girSelection, setGirSelection] = useState("Both");
  const [selectedApproachMiss, setSelectedApproachMiss] = useState(
    structuredClone(missApproaches)
  );
  const [upAndDownSelection, setUpAndDownSelection] = useState("Both");
  const [selectedPutts, setSelectedPutts] = useState(structuredClone(arr0to9));
  const [minFirstPuttDist, setMinFirstPuttDist] = useState(0);
  const [maxFirstPuttDist, setMaxFirstPuttDist] = useState(100);
  const [selectedPenaltyStrokes, setSelectedPenaltyStrokes] = useState(
    structuredClone(arr0to9)
  );
  const [selectedShotsInside100Yards, setSelectedShotsInside100Yards] =
    useState(structuredClone(arr0to9));

  useEffect(() => {
    setSelectedGames(gameData);
  }, [gameData]);

  useEffect(() => {
    let pSum = 0;
    let tPutts = 0;
    let fPuttDistAvg = 0;
    let yAvg = 0;
    for (let i = 0; i < currentHoles.length; i++) {
      const hole = currentHoles[i];
      pSum += hole.par;
      tPutts += hole.totalPutts;
      fPuttDistAvg += hole.firstPuttDist;
      yAvg += hole.yardage;
    }

    setParSum(pSum);
    setYardAverage(yAvg / currentHoles.length);
    setTotalPutts(tPutts);
    setFirstPuttDistAvg(fPuttDistAvg / currentHoles.length);
  }, [currentHoles]);

  useEffect(() => {
    const newSelection = [];

    selectedGames.forEach((game) => {
      for (let i = 0; i < game.holes.length; i++) {
        if (selectedPars.indexOf(game.holes[i].par) === -1) continue;
        if (game.holes[i].yardage < minYardage) continue;
        if (game.holes[i].yardage > maxYardage) continue;
        if (game.holes[i].score < minScore) continue;
        if (game.holes[i].score > maxScore) continue;
        if (selectedTeeShotClubs.indexOf(game.holes[i].club) === -1) continue;
        if (fairwaySelection === "True" && !game.holes[i].fairway) continue;
        if (fairwaySelection === "False" && game.holes[i].fairway) continue;
        if (selectedMissTee.indexOf(game.holes[i].missTee) === -1) continue;
        if (selectedApproachClubs.indexOf(game.holes[i].clubHit) === -1)
          continue;
        if (girSelection === "True" && !game.holes[i].gir) continue;
        if (girSelection === "False" && !game.holes[i].gir) continue;
        if (selectedApproachMiss.indexOf(game.holes[i].missApproach) === -1)
          continue;
        if (upAndDownSelection === "True" && !game.holes[i].upAndDown) continue;
        if (upAndDownSelection === "False" && game.holes[i].upAndDown) continue;
        if (selectedPutts.indexOf(game.holes[i].totalPutts) === -1) continue;
        if (game.holes[i].firstPuttDist < minFirstPuttDist) continue;
        if (game.holes[i].firstPuttDist > maxFirstPuttDist) continue;
        if (selectedPenaltyStrokes.indexOf(game.holes[i].penaltyStrokes) === -1)
          continue;
        if (
          selectedShotsInside100Yards.indexOf(game.holes[i].shotsInside100) ===
          -1
        )
          continue;
        newSelection.push(game.holes[i]);
      }
    });
    setCurrentHoles(newSelection);
  }, [
    selectedGames,
    selectedPars,
    minYardage,
    maxYardage,
    minScore,
    maxScore,
    selectedTeeShotClubs,
    fairwaySelection,
    selectedMissTee,
    selectedApproachClubs,
    girSelection,
    selectedApproachMiss,
    upAndDownSelection,
    selectedPutts,
    minFirstPuttDist,
    maxFirstPuttDist,
    selectedPenaltyStrokes,
    selectedShotsInside100Yards,
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
        <Typography
          textAlign="center"
          variant="h2"
          sx={{ fontWeight: "bold", width: "100%" }}
        >
          {userData.name}
        </Typography>

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

          <Typography
            textAlign="center"
            variant="h6"
            sx={{ width: "100%", fontWeight: "bold" }}
          >
            Total Putts: {totalPutts}
          </Typography>

          <Typography
            textAlign="center"
            variant="h6"
            sx={{ width: "100%", fontWeight: "bold" }}
          >
            Average First Putt Distance: {firstPuttDistAvg.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "500px" }}>
            <CustomSelect
              name="Select Game"
              options={[
                { value: gameData, label: "All Games" },
                ...gameData.map((game) => {
                  return {
                    value: game.id,
                    label:
                      game.title +
                      " - " +
                      formatDateFromMilliseconds(game.gameDate),
                  };
                }),
              ]}
              onChange={(e) => {
                if (e.target.value === gameData) {
                  setSelectedGames(gameData);
                  return;
                }
                const selectedGame = gameData.find(
                  (game) => game.id === e.target.value
                );
                setSelectedGames([selectedGame]);
              }}
              defaultValue={gameData}
            />
          </Box>
        </Box>

        <Grid2 container spacing={5} sx={{ width: "100%" }}>
          <Grid2 size={3}>
            <Stack spacing={1}>
              <CustomCheckboxDropdown
                name="Select Pars"
                items={[3, 4, 5]}
                selectedItems={selectedPars}
                setSelectedItems={setSelectedPars}
              />
              <CustomNumberInput
                name="Min Yardage"
                defaultValue={minYardage}
                onChange={(e) => setMinYardage(Number(e.target.value))}
              />
              <CustomNumberInput
                name="Max Yardage"
                defaultValue={maxYardage}
                onChange={(e) => setMaxYardage(Number(e.target.value))}
              />
              <CustomNumberInput
                name="Min Score"
                defaultValue={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
              />
              <CustomNumberInput
                name="Max Score"
                defaultValue={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
              />
            </Stack>
          </Grid2>
          <Grid2 size={3}>
            <Stack spacing={1}>
              <CustomCheckboxDropdown
                name="Select Tee Shot Clubs"
                items={clubs}
                selectedItems={selectedTeeShotClubs}
                setSelectedItems={setSelectedTeeShotClubs}
              />
              <CustomCheckboxDropdown
                name="Select Miss Tee"
                items={structuredClone(missTees)}
                selectedItems={selectedMissTee}
                setSelectedItems={setSelectedMissTee}
              />
              <CustomSelect
                name="Select Fairway"
                options={[
                  { value: "Both", label: "Both" },
                  { value: "True", label: "True" },
                  { value: "False", label: "False" },
                ]}
                onChange={(e) => {
                  setFairwaySelection(e.target.value);
                }}
                defaultValue={fairwaySelection}
              />
              <CustomCheckboxDropdown
                name="Select Approach Clubs"
                items={clubs}
                selectedItems={selectedApproachClubs}
                setSelectedItems={setSelectedApproachClubs}
              />
              <CustomSelect
                name="Select GIR"
                options={[
                  { value: "Both", label: "Both" },
                  { value: "True", label: "True" },
                  { value: "False", label: "False" },
                ]}
                onChange={(e) => {
                  setGirSelection(e.target.value);
                }}
                defaultValue={girSelection}
              />
            </Stack>
          </Grid2>
          <Grid2 size={3}>
            <Stack spacing={1}>
              <CustomCheckboxDropdown
                name="Select Approach Miss"
                items={missApproaches}
                selectedItems={selectedApproachMiss}
                setSelectedItems={setSelectedApproachMiss}
              />
              <CustomSelect
                name="Select Up and Down"
                options={[
                  { value: "Both", label: "Both" },
                  { value: "True", label: "True" },
                  { value: "False", label: "False" },
                ]}
                onChange={(e) => {
                  setUpAndDownSelection(e.target.value);
                }}
                defaultValue={upAndDownSelection}
              />
              <CustomCheckboxDropdown
                name="Select Putts"
                items={arr0to9}
                selectedItems={selectedPutts}
                setSelectedItems={setSelectedPutts}
              />
              <CustomNumberInput
                name="Min First Putt Distance"
                defaultValue={minFirstPuttDist}
                onChange={(e) => setMinFirstPuttDist(Number(e.target.value))}
              />
              <CustomNumberInput
                name="Max First Putt Distance"
                defaultValue={maxFirstPuttDist}
                onChange={(e) => setMaxFirstPuttDist(Number(e.target.value))}
              />
            </Stack>
          </Grid2>
          <Grid2 size={3}>
            <Stack spacing={1}>
              <CustomCheckboxDropdown
                name="Select Penalty Strokes"
                items={arr0to9}
                selectedItems={selectedPenaltyStrokes}
                setSelectedItems={setSelectedPenaltyStrokes}
              />
              <CustomCheckboxDropdown
                name="Select Shots Inside 100 Yards"
                items={arr0to9}
                selectedItems={selectedShotsInside100Yards}
                setSelectedItems={setSelectedShotsInside100Yards}
              />
            </Stack>
          </Grid2>
        </Grid2>

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
                value: getCount(currentHoles, { club: club }),
              };
            })}
          />
          <PieChartView
            title="Fairway"
            data={[
              {
                id: 0,
                label: "Yes",
                value: getCount(currentHoles, { fairway: true }),
                color: "#468f15",
              },
              {
                id: 1,
                label: "No",
                value: getCount(currentHoles, { fairway: false }),
                color: "#94042b",
              },
            ]}
          />
          <PieChartView
            title="Fairway Miss Direction"
            data={missTees.map((miss) => {
              return {
                id: miss,
                label: miss,
                value: getCount(currentHoles, { missTee: miss }),
              };
            })}
          />
          <PieChartView
            title={`Club Hit from Approach`}
            data={clubs.map((club) => {
              return {
                id: club,
                label: club,
                value: getCount(currentHoles, { clubHit: club }),
              };
            })}
          />
          <PieChartView
            title="Green in Regulation"
            data={[
              {
                id: 0,
                label: "Yes",
                value: getCount(currentHoles, { gir: true }),
                color: "#468f15",
              },
              {
                id: 1,
                label: "No",
                value: getCount(currentHoles, { gir: false }),
                color: "#94042b",
              },
            ]}
          />
          <PieChartView
            title="Approach Miss Direction"
            data={missApproaches.map((miss) => {
              return {
                id: miss,
                label: miss,
                value: getCount(currentHoles, { missApproach: miss }),
              };
            })}
          />
          <PieChartView
            title="Up and Down"
            data={[
              {
                id: 0,
                label: "Yes",
                value: getCount(currentHoles, { upAndDown: true }),
                color: "#468f15",
              },
              {
                id: 1,
                label: "No",
                value: getCount(currentHoles, { upAndDown: false }),
                color: "#94042b",
              },
            ]}
          />

          <PieChartView
            title={`Putts per Hole`}
            data={arr0to9.map((putt) => {
              return {
                id: putt,
                label: putt.toString(),
                value: getCount(currentHoles, {
                  totalPutts: putt,
                }),
              };
            })}
          />

          <PieChartView
            title="Penalty Strokes"
            data={arr0to9.map((penalty) => {
              return {
                id: penalty,
                label: penalty.toString(),
                value: getCount(currentHoles, {
                  penaltyStrokes: penalty,
                }),
              };
            })}
          />
          <PieChartView
            title="Shots Inside 100 Yards"
            data={arr0to9.map((shots) => {
              return {
                id: shots,
                label: shots.toString(),
                value: getCount(currentHoles, {
                  shotsInside100: shots,
                }),
              };
            })}
          />
        </Grid2>

        {selectedGames && selectedGames.length === 1 && (
          <HolesView holes={currentHoles} />
        )}
      </Grid2>
    </Box>
  );
};

export default UserView;
