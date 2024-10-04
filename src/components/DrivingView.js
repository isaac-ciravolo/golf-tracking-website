import React, { useState, useEffect } from "react";
import { Box, Grid2, Paper, Typography } from "@mui/material";
import { CustomSelect } from "./CustomComponents.js";
import PercentBox from "./PercentBox.js";
import HalfPizzaGraph from "./HalfPizzaGraph.js";

import { clubs, teeShots, colors } from "../util/Constants.js";

const DrivingView = ({ currentHoles }) => {
  const [selectedClub, setSelectedClub] = useState("-");
  const [selectedData, setSelectedData] = useState([]);
  const [selectedTotal, setSelectedTotal] = useState(0);
  const [allData, setAllData] = useState([]);
  const [allTotal, setAllTotal] = useState(0);

  useEffect(() => {
    const newSelectedData = [];
    let newSelectedTotal = 0;
    teeShots.slice(1, teeShots.length).forEach((shot) => {
      const newValue =
        getCount(currentHoles, {
          teeClub: selectedClub,
          teeShot: shot,
          par: 4,
        }) +
        getCount(currentHoles, {
          teeClub: selectedClub,
          teeShot: shot,
          par: 5,
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
    teeShots.slice(1, teeShots.length).forEach((shot) => {
      const newValue =
        getCount(currentHoles, { teeShot: shot, par: 4 }) +
        getCount(currentHoles, { teeShot: shot, par: 5 });
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
        p: 3,
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
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
            paddingLeft: 3,
            paddingRight: 3,
          }}
        >
          <Typography fontWeight={"bold"}>All Clubs</Typography>
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
          <HalfPizzaGraph sliceData={selectedData} />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            {selectedData.map((slice, index) => (
              <PercentBox
                key={index}
                title={slice.label}
                percent={(slice.value / selectedTotal) * 100}
                shots={slice.value}
              />
            ))}
          </Box>
        </Paper>
      </Grid2>
    </Box>
  );
};

export default DrivingView;
