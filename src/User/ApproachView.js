import React, { useState, useEffect } from "react";
import { Box, Grid2, Paper, Typography } from "@mui/material";
import { CustomSelect } from "../components/CustomComponents.js";
import BigPieChart from "../components/BigPieChart.js";
import PercentBox from "../components/PercentBox.js";
import { clubs, approachShots, colors, teeShots } from "../util/Constants.js";
import PizzaGraph from "../components/PizzaGraph.js";

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
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Box sx={{ display: "flex", gap: 3 }}>
        <Paper
          sx={{
            width: "500px",
            height: "600px",
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
        </Paper>
        <Paper
          sx={{
            width: "500px",
            height: "600px",
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
              {"GIRs per Round"}
            </Typography>
            <Typography noWrap variant="h4">
              {currentHoles
                .filter((hole) => hole.approachShot === "GIR")
                .length.toFixed(2)}
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
              {"GIRs when from Fairway"}
            </Typography>
            <Typography noWrap variant="h4">
              {currentHoles
                .filter(
                  (hole) =>
                    hole.approachShot === "GIR" && hole.teeShot === "Fairway"
                )
                .length.toFixed(2)}
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
              {"GIRs when not from Fairway"}
            </Typography>
            <Typography noWrap variant="h4">
              {currentHoles
                .filter(
                  (hole) =>
                    hole.approachShot === "GIR" && hole.teeShot !== "Fairway"
                )
                .length.toFixed(2)}
            </Typography>
          </Paper>
        </Paper>
      </Box>
    </Box>
  );
};

export default ApproachView;
