import React, { useState, useEffect } from "react";
import HolesView from "./HolesView.js";
import { Box, Grid2, Paper, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import {
  CustomSelect,
  CustomNumberInput,
  CustomCheckboxDropdown,
} from "./CustomComponents.js";
import BigPieChart from "./BigPieChart.js";
import PercentBox from "./PercentBox.js";

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

const teeShots = ["-", "Left", "Fairway", "Right"];

const TeeShotView = ({ currentHoles }) => {
  useEffect(() => {}, [currentHoles]);
  const [selectedClub, setSelectedClub] = useState("-");
  const [numLeft, setNumLeft] = useState(0);
  const [numFairway, setNumFairway] = useState(0);
  const [numRight, setNumRight] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setNumLeft(
      getCount(currentHoles, {
        teeShot: "Left",
        par: 4,
        teeClub: selectedClub,
      }) +
        getCount(currentHoles, {
          teeShot: "Left",
          par: 5,
          teeClub: selectedClub,
        })
    );
    setNumFairway(
      getCount(currentHoles, {
        teeShot: "Fairway",
        par: 4,
        teeClub: selectedClub,
      }) +
        getCount(currentHoles, {
          teeShot: "Left",
          par: 5,
          teeClub: selectedClub,
        })
    );
    setNumRight(
      getCount(currentHoles, {
        teeShot: "Right",
        par: 4,
        teeClub: selectedClub,
      }) +
        getCount(currentHoles, {
          teeShot: "Right",
          par: 5,
          teeClub: selectedClub,
        })
    );
    setTotal(
      getCount(currentHoles, { teeClub: selectedClub, par: 4 }) +
        getCount(currentHoles, { teeClub: selectedClub, par: 5 })
    );
  }, [currentHoles, selectedClub]);

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
      <Box sx={{ width: "500px" }}>
        <CustomSelect
          name={"Select Club"}
          onChange={(e) => setSelectedClub(e.target.value)}
          defaultValue={selectedClub}
          options={clubs.map((club) => {
            if (
              club === "-" ||
              getCount(currentHoles, { teeClub: club, par: 4 }) +
                getCount(currentHoles, { teeClub: club, par: 5 }) >
                0
            )
              return { value: club, label: club };
          })}
        />
      </Box>
      <Grid2 container spacing={3}>
        <Paper
          sx={{
            width: "500px",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          <BigPieChart
            title=""
            data={[
              { value: numLeft, label: "Missed Left", color: "blue" },
              { value: numFairway, label: "Fairway", color: "green" },
              { value: numRight, label: "Missed Right", color: "red" },
            ]}
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <PercentBox
              title="Missed Left"
              percent={(numLeft / total) * 100}
              shots={numLeft}
            />
            <PercentBox
              title="Fairway"
              percent={(numFairway / total) * 100}
              shots={numFairway}
            />
            <PercentBox
              title="Missed Right"
              percent={(numRight / total) * 100}
              shots={numRight}
            />
          </Box>
        </Paper>
      </Grid2>
    </Box>
  );
};

export default TeeShotView;
