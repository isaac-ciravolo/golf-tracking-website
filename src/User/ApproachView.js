import React, { useState, useEffect } from "react";
import { Box, Grid2, Paper, Typography } from "@mui/material";
import { CustomSelect } from "../components/CustomComponents.js";
import BigPieChart from "../components/BigPieChart.js";
import PercentBox from "../components/PercentBox.js";
import { clubs, approachShots, colors, teeShots } from "../util/Constants.js";
import PizzaGraph from "../components/PizzaGraph.js";
import { getCountAnd } from "../util/GetCount.js";

const ApproachView = ({
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

  useEffect(() => {
    console.log(numEighteenHolesGames);
    const newSelectedData = [];
    let newSelectedTotal = 0;
    approachShots.slice(1, approachShots.length).forEach((shot) => {
      const newValue = getCountAnd(currentHoles, {
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
      const newValue = getCountAnd(currentHoles, { approachShot: shot });
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
              sliceData={allData.filter(
                (slice) => slice.label !== "GIR" && slice.label !== "Sand"
              )}
              circleData={allData.find((slice) => slice.label === "GIR")}
              sandData={allData.find((slice) => slice.label === "Sand")}
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
                getCountAnd(currentHoles, { approachClub: club }) > 0
              )
                return { value: club, label: club };
            })}
          />
          {selectedData.length > 0 && (
            <PizzaGraph
              sliceData={selectedData.filter(
                (slice) => slice.label !== "GIR" && slice.label !== "Sand"
              )}
              circleData={selectedData.find((slice) => slice.label === "GIR")}
              sandData={selectedData.find((slice) => slice.label === "Sand")}
            />
          )}
        </Paper>
      </Box>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Paper
          sx={{
            width: "auto",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            p: 3,
          }}
        >
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
                {"GIRs per 18 Holes"}
              </Typography>
              <Typography noWrap variant="h4">
                {(
                  getCountAnd(currentEighteenHoles, { approachShot: "GIR" }) /
                  numEighteenHolesGames
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
                {"GIRs per 9 Holes"}
              </Typography>
              <Typography noWrap variant="h4">
                {(
                  getCountAnd(currentNineHoles, { approachShot: "GIR" }) /
                  numNineHolesGames
                ).toFixed(2)}
              </Typography>
            </Paper>
          </Box>
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
              {(
                (getCountAnd(currentHoles, {
                  teeShot: "Fairway",
                  approachShot: "GIR",
                }) /
                  getCountAnd(currentHoles, { teeShot: "Fairway" })) *
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
              {"GIRs when not from Fairway"}
            </Typography>
            <Typography noWrap variant="h4">
              {(
                (1 -
                  getCountAnd(currentHoles, {
                    teeShot: "Fairway",
                    approachShot: "GIR",
                  }) /
                    getCountAnd(currentHoles, { teeShot: "Fairway" })) *
                100
              ).toFixed(2) + "%"}
            </Typography>
          </Paper>
        </Paper>
      </Box>
    </Box>
  );
};

export default ApproachView;
