import React, { useState, useEffect } from "react";
import { Box, Grid2, Paper, Typography } from "@mui/material";
import { CustomSelect } from "./CustomComponents.js";
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

const ApproachView = ({ currentHoles }) => {
  useEffect(() => {}, [currentHoles]);
  const [selectedClub, setSelectedClub] = useState("-");
  const [numGIR, setNumGIR] = useState(0);
  const [numLeft, setNumLeft] = useState(0);
  const [numRight, setNumRight] = useState(0);
  const [numShortLeft, setNumShortLeft] = useState(0);
  const [numShortRight, setNumShortRight] = useState(0);
  const [numLongLeft, setNumLongLeft] = useState(0);
  const [numLongRight, setNumLongRight] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setNumLeft(
      getCount(currentHoles, {
        approachShot: "Left",
        approachClub: selectedClub,
      })
    );
    setNumRight(
      getCount(currentHoles, {
        approachShot: "Right",
        approachClub: selectedClub,
      })
    );
    setNumShortLeft(
      getCount(currentHoles, {
        approachShot: "Short Left",
        approachClub: selectedClub,
      })
    );
    setNumShortRight(
      getCount(currentHoles, {
        approachShot: "Short Right",
        approachClub: selectedClub,
      })
    );
    setNumLongLeft(
      getCount(currentHoles, {
        approachShot: "Long Left",
        approachClub: selectedClub,
      })
    );
    setNumLongRight(
      getCount(currentHoles, {
        approachShot: "Long Right",
        approachClub: selectedClub,
      })
    );
    setNumGIR(
      getCount(currentHoles, {
        approachShot: "GIR",
        approachClub: selectedClub,
      })
    );
    setTotal(getCount(currentHoles, { approachClub: selectedClub }));
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
              getCount(currentHoles, { approachClub: club }) > 0
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
              { value: numGIR, label: "GIR", color: "green" },
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
              title="GIR"
              percent={(numGIR / total) * 100}
              shots={numGIR}
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

export default ApproachView;
