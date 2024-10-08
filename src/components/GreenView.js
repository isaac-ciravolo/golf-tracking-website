import React, { useState, useEffect } from "react";
import { Box, Grid2, Paper, Typography } from "@mui/material";
import { CustomSelect } from "./CustomComponents.js";
import PercentBox from "./PercentBox.js";
import HalfPizzaGraph from "./HalfPizzaGraph.js";

import { clubs, UpAndDown, colors } from "../util/Constants.js";

const GreenView = ({ currentHoles }) => {
  const [selectedClub, setSelectedClub] = useState("-");
  const [selectedData, setSelectedData] = useState([]);
  const [selectedTotal, setSelectedTotal] = useState(0);
  const [allData, setAllData] = useState([]);
  const [allTotal, setAllTotal] = useState(0);

  useEffect(() => {
    console.log(currentHoles);
    const newSelectedData = [];
    let newSelectedTotal = 0;
    UpAndDown.slice(1, UpAndDown.length).forEach((shot) => {
      const newValue = getCount(currentHoles, {
        clubs: selectedClub,
        upAndDown: shot,
      });
      console.log(shot, newValue);
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
    UpAndDown.forEach((shot) => {
      const newValue = getCount(currentHoles, { upAndDown: shot });
      newAllData.push({
        value: newValue,
        label: shot,
        color: colors[shot],
      });
      newAllTotal += newValue;
    });
    setAllData(newAllData);
    setAllTotal(newAllTotal);
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
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          paddingLeft: 3,
          paddingRight: 3,
        }}
      >
        <Typography fontWeight={"bold"}>Up And Down All Clubs</Typography>
        <HalfPizzaGraph sliceData={allData} />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          {allData.map((slice, index) => (
            <PercentBox
              key={index}
              title={slice.label}
              percent={(slice.value / allTotal) * 100}
              shots={slice.value}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default GreenView;
