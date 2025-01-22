import React, { useState, useEffect } from "react";
import { Box, Grid2, Paper, Typography } from "@mui/material";
import { CustomSelect } from "../components/CustomComponents.js";
import PercentBox from "../components/PercentBox.js";
import HalfPizzaGraph from "../components/HalfPizzaGraph.js";

import { clubs, yesAndNo, colors, approachShots } from "../util/Constants.js";
import { getCountAnd, getCountOr } from "../util/GetCount.js";

const ShortGameView = ({ currentHoles }) => {
  const [selectedClub, setSelectedClub] = useState("-");
  const [selectedData, setSelectedData] = useState([]);
  const [selectedTotal, setSelectedTotal] = useState(0);
  const [allData, setAllData] = useState([]);
  const [allTotal, setAllTotal] = useState(0);
  const [totalPutts, setTotalPutts] = useState(0);
  const [parCounts, setParCounts] = useState({});
  const [clubFirstPuttDistData, setClubFirstPuttDistData] = useState([]);
  const [maxDistance, setMaxDistance] = useState(0);
  const [sandSave, setSandSave] = useState(0);

  useEffect(() => {
    const newSelectedData = [];
    let newSelectedTotal = 0;
    yesAndNo.slice(1, yesAndNo.length).forEach((shot) => {
      const newValue = getCountAnd(currentHoles, {
        upAndDownClub: selectedClub,
        upAndDown: shot,
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
    console.log(currentHoles[0]);
    yesAndNo.slice(1, yesAndNo.length).forEach((shot) => {
      const newValue = getCountAnd(currentHoles, { upAndDown: shot });
      newAllData.push({
        value: newValue,
        label: shot,
        color: colors[shot],
      });
      newAllTotal += newValue;
    });
    setAllData(newAllData);
    setAllTotal(newAllTotal);

    let newTotalPutts = 0;
    currentHoles.forEach((hole) => {
      newTotalPutts += hole.totalPutts;
    });
    setTotalPutts(newTotalPutts);

    const newParCounts = {};
    const newClubFirstPuttDistData = [];
    let newMaxDistance = 0;

    // Calculate scoring averages and par counts
    [3, 4, 5].forEach((par) => {
      const holes = currentHoles.filter((hole) => hole.par === par);
      const totalScore = holes.reduce((acc, hole) => acc + hole.score, 0);
      newParCounts[par] = holes.length;
    });

    // Calculate club first putt distances
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
    setParCounts(newParCounts);
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

  const getScramblingPercentage = () => {
    let count = 0;
    currentHoles.forEach((hole) => {
      if (hole.approachShot !== "GIR" && hole.score <= hole.par) count += 1;
    });
    return (count / currentHoles.length) * 100;
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
                getCountAnd(currentHoles, {
                  upAndDown: "Yes",
                  upAndDownClub: club,
                }) +
                  getCountAnd(currentHoles, {
                    upAndDown: "No",
                    upAndDownClub: club,
                  }) >
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
      </Box>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Paper
          sx={{
            width: "500px",
            minHeight: "500px",
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
              {"Sand Save %"}
            </Typography>
            <Typography noWrap variant="h4">
              {getCountAnd(currentHoles, { approachShot: "Sand" }) === 0
                ? "0.00"
                : (
                    (getCountAnd(currentHoles, {
                      approachShot: "Sand",
                      upAndDown: "Yes",
                    }) /
                      getCountAnd(currentHoles, { approachShot: "Sand" })) *
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
              {"Scrambling %"}
            </Typography>
            <Typography noWrap variant="h4">
              {getScramblingPercentage().toFixed(2) + "%"}
            </Typography>
          </Paper>
        </Paper>
      </Box>
    </Box>
  );
};

export default ShortGameView;
