import React, { useState, useEffect } from "react";
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

const TeeShotView = ({ currentHoles }) => {
  useEffect(() => {}, [currentHoles]);

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
      <Grid2 container spacing={3}></Grid2>
    </Box>
  );
};

export default TeeShotView;
