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
  const [clubFirstPuttDistData, setClubFirstPuttDistData] = useState([]);
  const [maxDistance, setMaxDistance] = useState(0);

  useEffect(() => {
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

    const newClubFirstPuttDistData = [];
    let newMaxDistance = 0;

    clubs.forEach((club) => {
      if (club === "-") return;
      let dist = 0;
      const holes = currentHoles.filter(
        (hole) => hole.approachClub === club && hole.approachShot === "GIR"
      );
      if (holes.length === 0) return;
      holes.forEach((hole) => {
        dist += hole.firstPuttDist;
      });
      newClubFirstPuttDistData.push({
        club: club,
        dist: dist / holes.length,
        count: holes.length,
      });
      newMaxDistance = Math.max(newMaxDistance, dist / holes.length);
    });

    newClubFirstPuttDistData.sort((a, b) => a.dist - b.dist);
    setClubFirstPuttDistData(newClubFirstPuttDistData);
    setMaxDistance(newMaxDistance);
  }, [currentHoles, selectedClub]);

  const getColorFromDistance = (distanceRatio) => {
    const green = { r: 144, g: 238, b: 144 }; // light green
    const orange = { r: 255, g: 165, b: 0 }; // orange

    // Interpolation
    const r = Math.round(green.r + (orange.r - green.r) * distanceRatio);
    const g = Math.round(green.g + (orange.g - green.g) * distanceRatio);
    const b = Math.round(green.b + (orange.b - green.b) * distanceRatio);

    return `rgb(${r},${g},${b})`;
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
      <Box sx={{ display: "flex", gap: 3, marginBottom: "10px" }}>
        <Paper
          sx={{
            width: "500px",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Typography gutterBottom textAlign={"center"} fontWeight={"bold"}>
            Approach Club First Putt Distance when GIR
          </Typography>
          <Grid2 sx={{ marginBottom: "10px" }} container>
            <Grid2 size={4}>
              <Typography fontWeight={"bold"} noWrap>
                Club
              </Typography>
            </Grid2>
            <Grid2 size={4}>
              <Typography fontWeight={"bold"} noWrap>
                Distance
              </Typography>
            </Grid2>
            <Grid2 size={4}>
              <Typography fontWeight={"bold"} noWrap>
                Count
              </Typography>
            </Grid2>
          </Grid2>
          {clubFirstPuttDistData.map((data, index) => {
            const color = getColorFromDistance(data.dist / maxDistance); // Get interpolated color

            return (
              <Grid2 container spacing={1} key={index}>
                <Grid2 size={4}>
                  <Typography noWrap>{data.club}</Typography>
                </Grid2>
                <Grid2 size={4}>
                  <Typography noWrap>
                    {data.dist.toFixed(2) + " feet"}
                  </Typography>
                </Grid2>
                <Grid2 size={4}>
                  <Typography noWrap>{data.count + " holes"}</Typography>
                </Grid2>
              </Grid2>
            );
          })}
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
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
            <Paper
              sx={{
                width: "200px",
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
                width: "200px",
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
