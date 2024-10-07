import React, { useState, useEffect } from "react";
import { Box, Grid2, Paper, Typography } from "@mui/material";
import { CustomSelect } from "./CustomComponents.js";
import BigPieChart from "./BigPieChart.js";
import PercentBox from "./PercentBox.js";
import { clubs, approachShots, colors } from "../util/Constants.js";
import PizzaGraph from "./PizzaGraph.js";

const ApproachView = ({ currentHoles }) => {
  const [selectedClub, setSelectedClub] = useState("-");
  const [selectedData, setSelectedData] = useState([]);
  const [selectedTotal, setSelectedTotal] = useState(0);
  const [allData, setAllData] = useState([]);
  const [allTotal, setAllTotal] = useState(0);

  useEffect(() => {
    const newSelectedData = [];
    let newSelectedTotal = 0;
    approachShots.slice(1, approachShots.length).forEach((shot) => {
      const newValue = getCount(currentHoles, {
        approachClub: selectedClub,
        approachShot: shot,
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
    approachShots.slice(1, approachShots.length).forEach((shot) => {
      const newValue = getCount(currentHoles, { approachShot: shot });
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
          height: "1000px",
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
        {allData.length > 0 && (
          <PizzaGraph
            sliceData={allData.filter((slice) => slice.label !== "GIR")}
            circleData={allData.find((slice) => slice.label === "GIR")}
          />
        )}
        <Grid2
          sx={{
            width: "100%",
          }}
          container
          spacing={2}
        >
          {allData.map((slice, index) => (
            <Grid2 size={4}>
              <PercentBox
                key={index}
                title={slice.label}
                percent={(slice.value / allTotal) * 100}
                shots={slice.value}
              />
            </Grid2>
          ))}
        </Grid2>
      </Paper>
      <Paper
        sx={{
          width: "500px",
          height: "1000px",
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
              getCount(currentHoles, { approachClub: club }) > 0
            )
              return { value: club, label: club };
          })}
        />
        {selectedData.length > 0 && (
          <PizzaGraph
            sliceData={selectedData.filter((slice) => slice.label !== "GIR")}
            circleData={selectedData.find((slice) => slice.label === "GIR")}
          />
        )}
        <Grid2
          sx={{
            width: "100%",
          }}
          container
          spacing={2}
        >
          {selectedData.map((slice, index) => (
            <Grid2 size={4} key={index}>
              <PercentBox
                title={slice.label}
                percent={(slice.value / selectedTotal) * 100}
                shots={slice.value}
              />
            </Grid2>
          ))}
        </Grid2>
      </Paper>
    </Box>
  );
};

export default ApproachView;
