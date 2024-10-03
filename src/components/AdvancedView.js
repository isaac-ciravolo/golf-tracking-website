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
import { clubs, teeShots, approachShots, arr0to9 } from "../util/Constants.js";

const AdvancedView = ({ currentHoles }) => {
  const [filteredHoles, setFilteredHoles] = useState([]);
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
  const [selectedApproachClubs, setSelectedApproachClubs] = useState(
    structuredClone(clubs)
  );
  const [selectedApproachShots, setSelectedApproachShots] = useState(
    structuredClone(approachShots)
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
    let pSum = 0;
    let tPutts = 0;
    let fPuttDistAvg = 0;
    let yAvg = 0;
    for (let i = 0; i < filteredHoles.length; i++) {
      const hole = filteredHoles[i];
      pSum += hole.par;
      tPutts += hole.totalPutts;
      fPuttDistAvg += hole.firstPuttDist;
      yAvg += hole.yardage;
    }

    setParSum(pSum);
    setYardAverage(yAvg / filteredHoles.length);
    setTotalPutts(tPutts);
    setFirstPuttDistAvg(fPuttDistAvg / filteredHoles.length);
  }, [filteredHoles]);

  useEffect(() => {
    const newSelection = [];
    currentHoles.forEach((hole) => {
      if (selectedPars.indexOf(hole.par) === -1) return;
      if (minYardage > hole.yardage) return;
      if (maxYardage < hole.yardage) return;
      if (minScore > hole.score) return;
      if (maxScore < hole.score) return;
      if (selectedTeeClubs.indexOf(hole.teeClub) === -1) return;
      if (selectedTeeShots.indexOf(hole.teeShot) === -1) return;
      if (selectedApproachClubs.indexOf(hole.approachClub) === -1) return;
      if (selectedApproachShots.indexOf(hole.approachShot) === -1) return;
      if (upAndDownSelection === "True" && hole.upAndDown === "No") return;
      if (upAndDownSelection === "False" && hole.upAndDown === "Yes") return;
      if (selectedPutts.indexOf(hole.totalPutts) === -1) return;
      if (minFirstPuttDist > hole.firstPuttDist) return;
      if (maxFirstPuttDist < hole.firstPuttDist) return;
      if (selectedPenaltyStrokes.indexOf(hole.penaltyStrokes) === -1) return;
      if (selectedShotsInside100Yards.indexOf(hole.shotsInside100) === -1)
        return;
      newSelection.push(hole);
    });
    setFilteredHoles(newSelection);
  }, [
    currentHoles,
    selectedPars,
    minYardage,
    maxYardage,
    minScore,
    maxScore,
    selectedTeeClubs,
    selectedTeeShots,
    selectedApproachClubs,
    selectedApproachShots,
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
            Number of Holes: {filteredHoles.length}
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
                selectedItems={selectedTeeClubs}
                setSelectedItems={setSelectedTeeClubs}
              />
              <CustomCheckboxDropdown
                name="Select Miss Tee"
                items={teeShots}
                selectedItems={selectedTeeShots}
                setSelectedItems={setSelectedTeeShots}
              />
              <CustomCheckboxDropdown
                name="Select Approach Clubs"
                items={clubs}
                selectedItems={selectedApproachClubs}
                setSelectedItems={setSelectedApproachClubs}
              />
            </Stack>
          </Grid2>
          <Grid2 size={3}>
            <Stack spacing={1}>
              <CustomCheckboxDropdown
                name="Select Approach Miss"
                items={approachShots}
                selectedItems={selectedApproachShots}
                setSelectedItems={setSelectedApproachShots}
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
                value: getCount(filteredHoles, { par: par }),
              };
            })}
          />
          <PieChartView
            title="Scores"
            data={arr0to9.map((score) => {
              return {
                id: score,
                label: score.toString(),
                value: getCount(filteredHoles, { score: score }),
              };
            })}
          />

          <PieChartView
            title={`Club Hit from Tee`}
            data={clubs.map((club) => {
              return {
                id: club,
                label: club,
                value: getCount(filteredHoles, { teeClub: club }),
              };
            })}
          />
          <PieChartView
            title="Fairway Miss Direction"
            data={teeShots.map((shot) => {
              return {
                id: shot,
                label: shot,
                value: getCount(filteredHoles, { teeShot: shot }),
              };
            })}
          />
          <PieChartView
            title={`Club Hit from Approach`}
            data={clubs.map((club) => {
              return {
                id: club,
                label: club,
                value: getCount(filteredHoles, { approachClub: club }),
              };
            })}
          />
          <PieChartView
            title="Approach Miss Direction"
            data={approachShots.map((shot) => {
              return {
                id: shot,
                label: shot,
                value: getCount(filteredHoles, { approachShot: shot }),
              };
            })}
          />
          <PieChartView
            title="Up and Down"
            data={[
              {
                id: 0,
                label: "Yes",
                value: getCount(filteredHoles, { upAndDown: "Yes" }),
                color: "#468f15",
              },
              {
                id: 1,
                label: "No",
                value: getCount(filteredHoles, { upAndDown: "No" }),
                color: "#94042b",
              },
              {
                id: 2,
                label: "-",
                value: getCount(filteredHoles, { upAndDown: "-" }),
                color: "#a0a0a0",
              },
            ]}
          />

          <PieChartView
            title={`Putts per Hole`}
            data={arr0to9.map((putt) => {
              return {
                id: putt,
                label: putt.toString(),
                value: getCount(filteredHoles, {
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
                value: getCount(filteredHoles, {
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
                value: getCount(filteredHoles, {
                  shotsInside100: shots,
                }),
              };
            })}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default AdvancedView;
